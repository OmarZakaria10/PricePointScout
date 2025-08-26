resource "aws_instance" "web-server" {
  count                  = 1
  ami                    = "ami-04a81a99f5ec58529" # Ubuntu 24.04 LTS (us-east-1)
  instance_type          = "t2.medium"
  key_name               = "vockey"
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  tags = {
    Name = "price-point-scout-${count.index + 1}"
  }
}
