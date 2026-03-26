# 📋 Hướng Dẫn Khắc Phục Lỗ Hổng Bảo Mật - Manual Guide

> **Tài liệu này cung cấp hướng dẫn chi tiết để kiểm tra và khắc phục các lỗ hổng bảo mật phổ biến trên Linux/Kubernetes cluster.**

---

## 📑 Mục Lục

1. [Quy Trình Chung](#1-quy-trình-chung)
2. [Package Updates (SAFE)](#2-package-updates-safe)
3. [Kernel Updates (REQUIRES REBOOT)](#3-kernel-updates-requires-reboot)
4. [SSH Hardening](#4-ssh-hardening)
5. [SSL/TLS Configuration](#5-ssltls-configuration)
6. [Sysctl Kernel Parameters](#6-sysctl-kernel-parameters)
7. [Docker/Container Security](#7-dockercontainer-security)
8. [Verification & Rollback](#8-verification--rollback)

---

## 1. Quy Trình Chung

### 1.1 Trước Khi Fix

```bash
# 1. Backup cấu hình quan trọng
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)
sudo cp /etc/sysctl.conf /etc/sysctl.conf.backup.$(date +%Y%m%d)

# 2. Ghi lại kernel version hiện tại
uname -r > /tmp/kernel_before.txt
dpkg -l | grep linux-image >> /tmp/kernel_before.txt

# 3. Kiểm tra disk space
df -h /

# 4. Kiểm tra running services
systemctl list-units --type=service --state=running > /tmp/services_before.txt
```

### 1.2 Thứ Tự Ưu Tiên Fix

| Priority | Category        | Risk Level | Downtime        |
| -------- | --------------- | ---------- | --------------- |
| P0       | Critical CVEs   | HIGH       | Varies          |
| P1       | Kernel Updates  | HIGH       | REBOOT REQUIRED |
| P2       | Package Updates | LOW        | Usually none    |
| P3       | Config Changes  | MEDIUM     | Service reload  |
| P4       | Hardening       | LOW        | May need reload |

---

## 2. Package Updates (SAFE)

### 2.1 Kiểm Tra Package Version

```bash
# Kiểm tra version hiện tại của package
dpkg -l | grep <package_name>

# Kiểm tra available updates
apt list --upgradable 2>/dev/null | grep <package_name>

# Xem thông tin chi tiết package
apt show <package_name>

# Xem changelog
apt changelog <package_name> 2>/dev/null | head -50
```

### 2.2 Update Specific Packages

```bash
# Update package lists
sudo apt update

# Upgrade specific package
sudo apt install --only-upgrade <package_name>

# Hoặc upgrade nhiều packages
sudo apt install --only-upgrade package1 package2 package3

# Verify sau khi update
dpkg -l | grep <package_name>
```

### 2.3 Common Package Fixes

#### Python (CVE-2025-13836)

```bash
# Check current version
python3 --version
dpkg -l | grep python3.10

# Fix
sudo apt update
sudo apt install --only-upgrade python3.10 python3.10-minimal libpython3.10 libpython3.10-minimal libpython3.10-stdlib

# Verify
python3 --version
```

#### klibc (CVE-2016-9843)

```bash
# Check
dpkg -l | grep klibc

# Fix
sudo apt update
sudo apt install --only-upgrade klibc-utils libklibc

# Verify
dpkg -l | grep klibc
```

#### Libtasn1 (CVE-2025-13151, CVE-2021-46848)

```bash
# Check
dpkg -l | grep libtasn1

# Fix
sudo apt update
sudo apt install --only-upgrade libtasn1-6 libtasn1-6-dev libtasn1-bin

# Verify
dpkg -l | grep libtasn1
```

#### libpng (Multiple CVEs)

```bash
# Check
dpkg -l | grep libpng

# Fix
sudo apt update
sudo apt install --only-upgrade libpng16-16

# Verify
dpkg -l | grep libpng
```

#### GLib (Multiple CVEs)

```bash
# Check
dpkg -l | grep libglib2.0

# Fix
sudo apt update
sudo apt install --only-upgrade libglib2.0-0 libglib2.0-bin

# Verify
dpkg -l | grep libglib2.0
```

#### urllib3 (Multiple CVEs)

```bash
# Check
pip3 show urllib3 2>/dev/null || dpkg -l | grep urllib3

# Fix (via apt)
sudo apt update
sudo apt install --only-upgrade python3-urllib3

# Verify
dpkg -l | grep urllib3
```

---

## 3. Kernel Updates (REQUIRES REBOOT)

### ⚠️ CẢNH BÁO: Kernel update YÊU CẦU REBOOT hệ thống!

### 3.1 Kiểm Tra Kernel Hiện Tại

```bash
# Kernel đang chạy
uname -r

# Tất cả kernel images đã cài
dpkg -l | grep linux-image | grep -E "^ii"

# Kernel available
apt list linux-image-* 2>/dev/null | grep -E "generic|server"

# Space used by old kernels
du -sh /lib/modules/*
```

### 3.2 Kiểm Tra Ubuntu Pro Status (cho ESM packages)

```bash
# Check if Ubuntu Pro is attached
sudo pro status

# If not attached and you have a token
sudo pro attach <TOKEN>

# Check if ESM repositories are enabled
apt policy | grep -i esm
```

### 3.3 Update Kernel (Standalone Server)

```bash
# 1. Update package lists
sudo apt update

# 2. Check available kernel versions
apt list linux-image-generic 2>/dev/null

# 3. Install latest kernel
sudo apt install linux-image-generic linux-headers-generic

# 4. Verify new kernel is installed
dpkg -l | grep linux-image

# 5. Reboot
echo "System will reboot in 60 seconds..."
sleep 60
sudo reboot

# 6. After reboot, verify
uname -r
```

### 3.4 Update Kernel on Kubernetes Node (Rolling Update)

```bash
# === TRÊN CONTROL PLANE / BASTION HOST ===

# 1. Get node list
kubectl get nodes

# 2. Cordon node (ngăn schedule pods mới)
NODE_NAME="<node_name>"
kubectl cordon $NODE_NAME

# 3. Drain node (di chuyển pods)
kubectl drain $NODE_NAME \
    --ignore-daemonsets \
    --delete-emptydir-data \
    --force \
    --grace-period=300

# 4. Verify pods đã migrate
kubectl get pods --all-namespaces -o wide | grep $NODE_NAME
# Chỉ còn daemonset pods

# === SSH VÀO NODE ===

# 5. SSH to node
ssh $NODE_NAME

# 6. Update kernel
sudo apt update
sudo apt install -y linux-image-generic linux-headers-generic linux-modules-extra-$(uname -r | sed 's/-generic//')-generic

# 7. Reboot
sudo reboot

# === SAU KHI NODE REBOOT ===

# 8. (From control plane) Check node status
kubectl get nodes

# 9. Wait for node Ready
watch kubectl get nodes

# 10. Uncordon node
kubectl uncordon $NODE_NAME

# 11. Verify node healthy
kubectl describe node $NODE_NAME | grep -A5 Conditions

# 12. Verify pods running
kubectl get pods --all-namespaces -o wide | grep $NODE_NAME

# === REPEAT CHO NODE TIẾP THEO ===
```

### 3.5 Rollback Kernel (nếu có vấn đề)

```bash
# 1. Reboot và chọn kernel cũ từ GRUB menu
# Hoặc set default kernel

# 2. List available kernels
grep -E "menuentry|submenu" /boot/grub/grub.cfg | head -20

# 3. Set default kernel (ví dụ kernel thứ 2)
# Edit /etc/default/grub
sudo nano /etc/default/grub
# Thay đổi: GRUB_DEFAULT=0 thành GRUB_DEFAULT="1>2"

# 4. Update GRUB
sudo update-grub

# 5. Reboot
sudo reboot
```

### 3.6 Cleanup Old Kernels

```bash
# Check old kernels
dpkg -l | grep linux-image | grep -v $(uname -r | sed 's/-generic//')

# Remove old kernels (giữ lại kernel đang dùng + 1 backup)
sudo apt autoremove --purge

# Hoặc manual remove
sudo apt remove linux-image-5.15.0-94-generic linux-modules-5.15.0-94-generic
```

---

## 4. SSH Hardening

### 4.1 Kiểm Tra Cấu Hình SSH Hiện Tại

```bash
# View current config
sudo sshd -T | grep -E "(passwordauth|permitroot|ciphers|macs|kex|pubkey)"

# Check SSH version
ssh -V

# Check active connections
ss -tnp | grep :22
who
```

### 4.2 Common SSH Vulnerabilities & Fixes

#### Weak Ciphers

```bash
# Check current ciphers
sudo sshd -T | grep ciphers

# Backup config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Add strong ciphers (append to sshd_config)
sudo tee -a /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
# SSH Hardening - Applied $(date +%Y-%m-%d)
Ciphers aes256-gcm@openssh.com,chacha20-poly1305@openssh.com,aes256-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp521
EOF

# Test config
sudo sshd -t

# Reload SSH (NOT restart to keep current sessions)
sudo systemctl reload sshd

# Verify
sudo sshd -T | grep -E "(ciphers|macs|kex)"
```

#### Root Login / Password Authentication

```bash
# Check current settings
sudo sshd -T | grep -E "(permitroot|passwordauth)"

# Disable (add to hardening.conf)
sudo tee -a /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
EOF

# ⚠️ TRƯỚC KHI APPLY, đảm bảo bạn có SSH key access!
# Test config
sudo sshd -t

# Reload
sudo systemctl reload sshd
```

### 4.3 Verify SSH Security

```bash
# Test from another terminal (DON'T close current session)
ssh -o PreferredAuthentications=password user@localhost
# Should fail if PasswordAuthentication no

# Check SSH audit
ssh-audit localhost 2>/dev/null || echo "Install: pip install ssh-audit"
```

---

## 5. SSL/TLS Configuration

### 5.1 Kiểm Tra SSL/TLS

```bash
# Check OpenSSL version
openssl version

# Check supported ciphers
openssl ciphers -v

# Test connection to a service
openssl s_client -connect localhost:443 < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Check TLS versions
openssl s_client -connect localhost:443 -tls1_2 < /dev/null 2>&1 | grep -i "protocol"
openssl s_client -connect localhost:443 -tls1_3 < /dev/null 2>&1 | grep -i "protocol"
```

### 5.2 Update OpenSSL

```bash
# Check current version
openssl version

# Update
sudo apt update
sudo apt install --only-upgrade openssl libssl3

# Verify
openssl version
```

### 5.3 Nginx SSL Hardening Example

```bash
# Backup
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Add to nginx.conf (http block)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 6. Sysctl Kernel Parameters

### 6.1 Kiểm Tra Sysctl Hiện Tại

```bash
# View all current settings
sudo sysctl -a 2>/dev/null > /tmp/sysctl_current.txt

# Check specific security settings
sysctl net.ipv4.conf.all.accept_redirects
sysctl net.ipv4.conf.all.send_redirects
sysctl kernel.randomize_va_space
sysctl net.ipv4.tcp_syncookies
```

### 6.2 Apply Security Settings

```bash
# Create security sysctl file
sudo tee /etc/sysctl.d/99-security.conf << 'EOF'
# === Network Security ===
# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Enable SYN cookies
net.ipv4.tcp_syncookies = 1

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Enable reverse path filtering
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Log martian packets
net.ipv4.conf.all.log_martians = 1

# === Kernel Security ===
# Enable ASLR
kernel.randomize_va_space = 2

# Restrict dmesg access
kernel.dmesg_restrict = 1

# Restrict kernel pointer access
kernel.kptr_restrict = 2
EOF

# Apply immediately
sudo sysctl -p /etc/sysctl.d/99-security.conf

# Verify
sysctl net.ipv4.conf.all.accept_redirects
sysctl kernel.randomize_va_space
```

---

## 7. Docker/Container Security

### 7.1 Kiểm Tra Docker Security

```bash
# Docker version
docker version

# Check running containers
docker ps

# Check container security options
docker inspect <container_id> | jq '.[0].HostConfig.SecurityOpt'

# Check Docker daemon config
cat /etc/docker/daemon.json
```

### 7.2 Update Docker

```bash
# Check current version
docker --version

# Update Docker
sudo apt update
sudo apt install --only-upgrade docker-ce docker-ce-cli containerd.io

# Restart Docker
sudo systemctl restart docker

# Verify
docker --version
docker info
```

### 7.3 Container Security Best Practices

```bash
# Run containers as non-root
docker run --user 1000:1000 <image>

# Drop capabilities
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE <image>

# Read-only filesystem
docker run --read-only <image>

# Limit resources
docker run --memory=512m --cpus=0.5 <image>
```

---

## 8. Verification & Rollback

### 8.1 Verification Checklist

```bash
#!/bin/bash
# verification_checklist.sh

echo "=== System Verification ==="
echo ""

echo "1. Kernel Version:"
uname -r

echo ""
echo "2. Running Services:"
systemctl is-system-running

echo ""
echo "3. Failed Services:"
systemctl --failed

echo ""
echo "4. SSH Status:"
systemctl is-active sshd

echo ""
echo "5. Network Connectivity:"
ping -c 1 8.8.8.8 > /dev/null && echo "OK" || echo "FAILED"

echo ""
echo "6. Disk Space:"
df -h / | tail -1

echo ""
echo "7. Memory:"
free -h | grep Mem

echo ""
echo "8. Load Average:"
uptime

echo ""
echo "9. Package Updates Pending:"
apt list --upgradable 2>/dev/null | wc -l
```

### 8.2 Rollback Procedures

#### Package Rollback

```bash
# Find previous version
apt-cache showpkg <package_name>

# Install specific version
sudo apt install <package_name>=<version>

# Example
sudo apt install python3.10=3.10.12-1~22.04.11
```

#### Config Rollback

```bash
# SSH config
sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
sudo systemctl reload sshd

# Sysctl
sudo rm /etc/sysctl.d/99-security.conf
sudo sysctl --system
```

#### Kernel Rollback

```bash
# See available kernels
grep -E "menuentry" /boot/grub/grub.cfg | grep -v recovery

# Boot to previous kernel via GRUB menu on reboot
# Or set via GRUB_DEFAULT in /etc/default/grub
```

---

## 📝 Ghi Chú Quan Trọng

1. **LUÔN TEST trên môi trường non-prod trước**
2. **BACKUP CONFIG trước khi thay đổi**
3. **KHÔNG đóng SSH session khi đang thay đổi SSH config**
4. **Rolling update cho K8s cluster - từng node một**
5. **Có rollback plan trước khi thực hiện**
6. **Document tất cả thay đổi đã thực hiện**

---

## 📚 Tham Khảo

- [Ubuntu Security Notices](https://ubuntu.com/security/notices)
- [CIS Benchmarks](https://www.cisecurity.org/benchmark/ubuntu_linux)
- [NIST NVD](https://nvd.nist.gov/)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/overview/)
