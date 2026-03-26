---
name: nessus-vuln-analyzer
description: Analyze Nessus vulnerability scan reports for Linux/Kubernetes infrastructure. Provides prioritized remediation guidance with safe, non-disruptive fixes.
---

# Nessus Vulnerability Analyzer

## 🎯 Purpose

Skill này giúp phân tích báo cáo quét lỗ hổng Nessus cho hạ tầng Linux/Kubernetes, tổng hợp các findings và đưa ra hướng dẫn khắc phục an toàn, không ảnh hưởng đến hoạt động của hệ thống.

## 📋 When to Use

- Khi có báo cáo Nessus scan (HTML, CSV, Nessus format)
- Cần phân loại và ưu tiên các lỗ hổng
- Cần hướng dẫn fix an toàn cho hạ tầng production
- Làm việc với K8s cluster, Linux servers

---

## 🔍 Workflow

### Phase 1: Report Analysis

1. **Đọc và parse Nessus report** (HTML/CSV)
2. **Extract key information:**
   - Hosts được quét
   - Vulnerability counts by severity (Critical/High/Medium/Low/Info)
   - Plugin IDs và CVEs
   - Affected packages/services

### Phase 2: Prioritization Matrix

```
┌─────────────┬─────────────────────────────────────────────────────────────┐
│ Priority    │ Criteria                                                    │
├─────────────┼─────────────────────────────────────────────────────────────┤
│ P0 (URGENT) │ Critical + Internet-facing + Exploit available              │
│ P1 (HIGH)   │ Critical + Internal OR High + Internet-facing + Exploit     │
│ P2 (MEDIUM) │ High + Internal OR Medium + Exploit available               │
│ P3 (LOW)    │ Medium + No exploit OR Low severity                         │
│ P4 (INFO)   │ Informational findings                                      │
└─────────────┴─────────────────────────────────────────────────────────────┘
```

### Phase 3: Remediation Categories

#### Category A: Package Updates (SAFE)

```bash
# Ubuntu/Debian
apt update && apt upgrade -y <package_name>

# RHEL/CentOS/Rocky
dnf update -y <package_name>

# Kubernetes nodes - Use rolling update approach
# 1. Cordon node
kubectl cordon <node_name>
# 2. Drain workloads
kubectl drain <node_name> --ignore-daemonsets --delete-emptydir-data
# 3. Apply updates
ssh <node_name> "sudo apt update && sudo apt upgrade -y <packages>"
# 4. Uncordon
kubectl uncordon <node_name>
```

#### Category B: Configuration Changes (CAUTION)

- SSH hardening
- TLS/SSL configuration
- Kernel parameters

```bash
# Always backup first!
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)

# Test config before applying
sshd -t

# Apply gracefully
systemctl reload sshd
```

#### Category C: Service Restart Required (PLANNED)

- Requires maintenance window
- Notify stakeholders
- Prepare rollback plan

---

## 📊 Output Format

### 1. Executive Summary

```markdown
## 📊 Nessus Scan Summary: <Scan_Name>

**Scan Date:** <Date>
**Hosts Scanned:** <Count>
**Total Findings:** <Count>

### Severity Breakdown

| Severity | Count | % of Total |
| -------- | ----- | ---------- |
| Critical | X     | X%         |
| High     | X     | X%         |
| Medium   | X     | X%         |
| Low      | X     | X%         |
| Info     | X     | X%         |
```

### 2. Top Vulns by Risk

````markdown
## 🔴 Top Critical/High Vulnerabilities

### CVE-XXXX-XXXXX: <Title>

- **Affected Hosts:** host1, host2, ...
- **CVSS Score:** X.X
- **Plugin ID:** XXXXX
- **Affected Package:** <package_name>
- **Fix Command:**
  ```bash
  apt update && apt upgrade -y <package>
  ```
````

- **Rollback:**
  ```bash
  apt install <package>=<old_version>
  ```

````

### 3. Ansible Playbook Template
```yaml
---
# remediation_playbook.yml
# Generated from Nessus scan: <scan_name>
# Date: <date>

- name: Remediate Nessus Findings
  hosts: all
  become: yes
  serial: 1  # Rolling update - one host at a time
  max_fail_percentage: 0  # Stop on any failure

  vars:
    packages_to_update:
      - package1
      - package2

  pre_tasks:
    - name: Check if host is in K8s cluster
      shell: kubectl get nodes -o name 2>/dev/null | grep $(hostname)
      register: k8s_node_check
      ignore_errors: yes

    - name: Cordon K8s node if applicable
      delegate_to: localhost
      shell: kubectl cordon {{ inventory_hostname }}
      when: k8s_node_check.rc == 0

    - name: Drain K8s node if applicable
      delegate_to: localhost
      shell: >
        kubectl drain {{ inventory_hostname }}
        --ignore-daemonsets
        --delete-emptydir-data
        --force
      when: k8s_node_check.rc == 0

  tasks:
    - name: Update vulnerable packages
      apt:
        name: "{{ packages_to_update }}"
        state: latest
        update_cache: yes
      when: ansible_os_family == "Debian"

  post_tasks:
    - name: Uncordon K8s node if applicable
      delegate_to: localhost
      shell: kubectl uncordon {{ inventory_hostname }}
      when: k8s_node_check.rc == 0
````

---

## ⚠️ Safety Guidelines

### DO ✅

- Always test in non-prod first
- Use rolling updates (one node at a time)
- Create backups before changes
- Document all changes
- Have rollback plan ready
- Schedule during maintenance windows for risky changes

### DON'T ❌

- Never apply changes to all nodes simultaneously
- Don't skip version validation
- Don't ignore kernel updates without reboot plan
- Don't fix Low/Info items before Critical/High

---

## 🔧 Common Vulnerability Categories

### 1. OS Package Vulnerabilities

**Solution:** `apt upgrade` / `dnf update`
**Risk Level:** Usually SAFE with testing

### 2. SSL/TLS Issues

- Weak ciphers
- Outdated protocols
- Certificate issues

**Solution:** Update crypto config

```bash
# /etc/ssl/openssl.cnf adjustments
# nginx/apache ssl configuration
```

### 3. SSH Hardening

**Common Findings:**

- Weak algorithms
- Root login enabled
- Password authentication

**Solution:**

```bash
# /etc/ssh/sshd_config
PasswordAuthentication no
PermitRootLogin no
Ciphers aes256-gcm@openssh.com,chacha20-poly1305@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
```

### 4. Kernel Parameters

**Solution:** Sysctl tuning

```bash
# /etc/sysctl.d/99-security.conf
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
kernel.randomize_va_space = 2
```

---

## 📁 Skill File Structure

```
~/.gemini/skills/nessus-vuln-analyzer/
├── SKILL.md                              # This file
├── scripts/
│   └── parse_nessus_html.py              # Parser for Nessus HTML reports
└── references/
    └── manual_remediation_guide.md       # Detailed manual fix instructions
```

---

## 📚 Reference Documents

| Document                                 | Purpose                                                   |
| ---------------------------------------- | --------------------------------------------------------- |
| `references/manual_remediation_guide.md` | Chi tiết hướng dẫn fix manual cho từng loại vulnerability |
| `scripts/parse_nessus_html.py`           | Python script để parse Nessus HTML report                 |

### Sử dụng Parser Script

```bash
# Output markdown summary
python3 ~/.gemini/skills/nessus-vuln-analyzer/scripts/parse_nessus_html.py <report.html> markdown

# Output JSON (for automation)
python3 ~/.gemini/skills/nessus-vuln-analyzer/scripts/parse_nessus_html.py <report.html> json

# Output CSV
python3 ~/.gemini/skills/nessus-vuln-analyzer/scripts/parse_nessus_html.py <report.html> csv
```

---

## 📁 Output Artifacts

When analyzing a Nessus report, create these files **IN ORDER**:

```
docs/security/
├── 1_nessus_summary_<date>.md        # Executive summary (always first)
├── 2_manual_remediation_<date>.md    # ⭐ MANUAL guide - LUÔN TẠO TRƯỚC
├── 3_vuln_prioritization_<date>.md   # Prioritized list by severity
└── ansible/
    └── remediate_<date>.yml          # Ansible playbook (optional, after manual guide)
```

### ⭐ QUAN TRỌNG: Luôn tạo Manual Guide TRƯỚC Ansible Playbook

Workflow bắt buộc:

1. ✅ Parse report → Tạo Summary
2. ✅ **Tạo Manual Remediation Guide** với step-by-step commands
3. ✅ Tạo Prioritization Matrix
4. ⏳ Tạo Ansible Playbook (sau khi user review manual guide)

---

## 🚀 Quick Start

1. Provide Nessus report file path
2. Provide system inventory (optional: system_report.txt)
3. Specify target environment type (K8s/VM/Bare-metal)
4. Get prioritized remediation plan

```
User: Analyze @[path/to/nessus_report.html] for my K8s cluster
AI: [Uses this skill to parse, prioritize, and generate remediation plan]
```
