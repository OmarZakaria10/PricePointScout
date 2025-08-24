output "instance_ips" {
  value = aws_instance.web-server[*].public_ip
}
