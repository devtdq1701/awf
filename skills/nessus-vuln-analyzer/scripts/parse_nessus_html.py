#!/usr/bin/env python3
"""
Nessus HTML Report Parser
Extracts vulnerability information from Nessus HTML scan reports.

Usage:
    python parse_nessus_html.py <nessus_report.html> [output_format]

Output formats: json, csv, markdown (default: markdown)
"""

import sys
import re
import json
import csv
from pathlib import Path
from html.parser import HTMLParser
from dataclasses import dataclass, field, asdict
from typing import List, Optional
from collections import defaultdict


@dataclass
class Vulnerability:
    """Represents a single vulnerability finding."""
    plugin_id: str = ""
    title: str = ""
    severity: str = ""
    cvss_score: float = 0.0
    cvss_vector: str = ""
    cve: List[str] = field(default_factory=list)
    description: str = ""
    solution: str = ""
    affected_hosts: List[str] = field(default_factory=list)
    affected_packages: List[str] = field(default_factory=list)
    see_also: List[str] = field(default_factory=list)


@dataclass
class Host:
    """Represents a scanned host."""
    ip: str = ""
    mac: str = ""
    os: str = ""
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    info_count: int = 0


@dataclass
class ScanReport:
    """Represents the full Nessus scan report."""
    name: str = ""
    scan_date: str = ""
    hosts: List[Host] = field(default_factory=list)
    vulnerabilities: List[Vulnerability] = field(default_factory=list)

    @property
    def total_critical(self) -> int:
        return sum(h.critical_count for h in self.hosts)

    @property
    def total_high(self) -> int:
        return sum(h.high_count for h in self.hosts)

    @property
    def total_medium(self) -> int:
        return sum(h.medium_count for h in self.hosts)

    @property
    def total_low(self) -> int:
        return sum(h.low_count for h in self.hosts)

    @property
    def total_info(self) -> int:
        return sum(h.info_count for h in self.hosts)


def extract_severity_from_color(color: str) -> str:
    """Map Nessus color codes to severity levels."""
    color_map = {
        "#91243E": "Critical",
        "#DD4B50": "High",
        "#F18C43": "Medium",
        "#F8C851": "Low",
        "#67ACE1": "Info"
    }
    return color_map.get(color, "Unknown")


def parse_nessus_html(html_content: str) -> ScanReport:
    """
    Parse Nessus HTML report and extract vulnerabilities.

    Args:
        html_content: Raw HTML content of Nessus report

    Returns:
        ScanReport object with parsed data
    """
    report = ScanReport()

    # Extract scan name
    name_match = re.search(r'<h3 style="[^"]*">([^<]+)</h3>', html_content)
    if name_match:
        report.name = name_match.group(1).strip()

    # Extract scan date
    date_match = re.search(r'<h4[^>]*>([^<]+)</h4>', html_content)
    if date_match:
        report.scan_date = date_match.group(1).strip()

    # Extract hosts from table of contents
    host_pattern = re.compile(r'<a href="#id\d+">(\d+\.\d+\.\d+\.\d+)</a>')
    host_ips = host_pattern.findall(html_content)

    # Extract vulnerability counts per host
    # Pattern: Critical/High/Medium/Low/Info counts in colored divs
    count_pattern = re.compile(
        r'<div style="[^"]*background:\s*(#[A-Fa-f0-9]{6})[^"]*"[^>]*>(\d+)</div>'
    )

    # Find each host section and extract counts
    host_section_pattern = re.compile(
        r'<div[^>]*id="id(\d+)"[^>]*>(\d+\.\d+\.\d+\.\d+)</div>'
    )

    # Parse host info sections
    for ip in host_ips:
        host = Host(ip=ip)

        # Find the section for this host
        host_section = re.search(
            rf'{re.escape(ip)}.*?(?=<div[^>]*id="id\d+"[^>]*>\d+\.\d+\.\d+\.\d+</div>|$)',
            html_content,
            re.DOTALL
        )

        if host_section:
            section_text = host_section.group(0)

            # Extract severity counts
            counts = count_pattern.findall(section_text)
            if len(counts) >= 5:
                for color, count in counts[:5]:
                    severity = extract_severity_from_color(color)
                    count_val = int(count)
                    if severity == "Critical":
                        host.critical_count = count_val
                    elif severity == "High":
                        host.high_count = count_val
                    elif severity == "Medium":
                        host.medium_count = count_val
                    elif severity == "Low":
                        host.low_count = count_val
                    elif severity == "Info":
                        host.info_count = count_val

            # Extract OS
            os_match = re.search(r'OS:</td>\s*<td[^>]*>([^<]+)</td>', section_text)
            if os_match:
                host.os = os_match.group(1).strip()

        report.hosts.append(host)

    # Extract individual vulnerabilities
    vuln_pattern = re.compile(
        r'<div[^>]*style="[^"]*background:\s*(#[A-Fa-f0-9]{6})[^"]*"[^>]*onclick="[^"]*"[^>]*>'
        r'(\d+)\s*-\s*([^<]+)</div>',
        re.DOTALL
    )

    for match in vuln_pattern.finditer(html_content):
        color = match.group(1)
        plugin_id = match.group(2)
        title = match.group(3).strip()

        vuln = Vulnerability(
            plugin_id=plugin_id,
            title=title,
            severity=extract_severity_from_color(color)
        )

        # Find the container for this vulnerability
        container_id = re.search(rf'id="id{plugin_id}-container"', html_content)
        if container_id:
            start_pos = container_id.start()
            end_pos = html_content.find('</div>\n<div', start_pos + 1000) or len(html_content)
            vuln_section = html_content[start_pos:end_pos]

            # Extract CVSS score
            cvss_match = re.search(r'(\d+\.\d+)\s*\(CVSS', vuln_section)
            if cvss_match:
                vuln.cvss_score = float(cvss_match.group(1))

            # Extract CVEs
            cve_matches = re.findall(r'CVE-\d{4}-\d+', vuln_section)
            vuln.cve = list(set(cve_matches))

            # Extract solution
            sol_match = re.search(
                r'Solution.*?</div>\s*<div[^>]*>([^<]+)',
                vuln_section,
                re.DOTALL | re.IGNORECASE
            )
            if sol_match:
                vuln.solution = sol_match.group(1).strip()

        # Avoid duplicates
        existing_ids = [v.plugin_id for v in report.vulnerabilities]
        if plugin_id not in existing_ids:
            report.vulnerabilities.append(vuln)

    return report


def output_markdown(report: ScanReport) -> str:
    """Generate markdown summary of the report."""
    lines = []

    lines.append(f"# 📊 Nessus Scan Summary: {report.name}")
    lines.append("")
    lines.append(f"**Scan Date:** {report.scan_date}")
    lines.append(f"**Hosts Scanned:** {len(report.hosts)}")
    lines.append("")

    # Severity breakdown
    lines.append("## Severity Breakdown")
    lines.append("")
    lines.append("| Severity | Count |")
    lines.append("|----------|-------|")
    lines.append(f"| 🔴 Critical | {report.total_critical} |")
    lines.append(f"| 🟠 High | {report.total_high} |")
    lines.append(f"| 🟡 Medium | {report.total_medium} |")
    lines.append(f"| 🟢 Low | {report.total_low} |")
    lines.append(f"| 🔵 Info | {report.total_info} |")
    lines.append("")

    # Host summary
    lines.append("## Hosts Summary")
    lines.append("")
    lines.append("| Host | OS | Critical | High | Medium | Low |")
    lines.append("|------|-----|----------|------|--------|-----|")
    for host in report.hosts:
        lines.append(
            f"| {host.ip} | {host.os or 'Unknown'} | "
            f"{host.critical_count} | {host.high_count} | "
            f"{host.medium_count} | {host.low_count} |"
        )
    lines.append("")

    # Top vulnerabilities
    critical_vulns = [v for v in report.vulnerabilities if v.severity == "Critical"]
    high_vulns = [v for v in report.vulnerabilities if v.severity == "High"]

    if critical_vulns or high_vulns:
        lines.append("## 🔴 Critical & High Vulnerabilities")
        lines.append("")

        for vuln in sorted(critical_vulns + high_vulns,
                          key=lambda x: x.cvss_score, reverse=True)[:20]:
            lines.append(f"### [{vuln.severity}] {vuln.title}")
            lines.append(f"- **Plugin ID:** {vuln.plugin_id}")
            if vuln.cvss_score:
                lines.append(f"- **CVSS Score:** {vuln.cvss_score}")
            if vuln.cve:
                lines.append(f"- **CVEs:** {', '.join(vuln.cve)}")
            if vuln.solution:
                lines.append(f"- **Solution:** {vuln.solution}")
            lines.append("")

    return "\n".join(lines)


def output_json(report: ScanReport) -> str:
    """Generate JSON output of the report."""
    data = {
        "name": report.name,
        "scan_date": report.scan_date,
        "summary": {
            "total_hosts": len(report.hosts),
            "total_critical": report.total_critical,
            "total_high": report.total_high,
            "total_medium": report.total_medium,
            "total_low": report.total_low,
            "total_info": report.total_info,
        },
        "hosts": [asdict(h) for h in report.hosts],
        "vulnerabilities": [asdict(v) for v in report.vulnerabilities]
    }
    return json.dumps(data, indent=2)


def output_csv(report: ScanReport) -> str:
    """Generate CSV output of vulnerabilities."""
    import io
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "Plugin ID", "Severity", "Title", "CVSS Score",
        "CVEs", "Solution"
    ])

    # Data
    for vuln in report.vulnerabilities:
        writer.writerow([
            vuln.plugin_id,
            vuln.severity,
            vuln.title,
            vuln.cvss_score,
            "; ".join(vuln.cve),
            vuln.solution
        ])

    return output.getvalue()


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    report_path = Path(sys.argv[1])
    output_format = sys.argv[2] if len(sys.argv) > 2 else "markdown"

    if not report_path.exists():
        print(f"Error: File not found: {report_path}")
        sys.exit(1)

    # Read and parse
    html_content = report_path.read_text(encoding='utf-8', errors='ignore')
    report = parse_nessus_html(html_content)

    # Output
    if output_format == "json":
        print(output_json(report))
    elif output_format == "csv":
        print(output_csv(report))
    else:
        print(output_markdown(report))


if __name__ == "__main__":
    main()
