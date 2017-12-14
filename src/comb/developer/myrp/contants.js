export const myRp_info = {
  daemon: 'systemctl daemon-reload',
  docker_enable: 'systemctl enable docker',
  docker_start: 'systemctl start docker',
  docker_reload: 'systemctl daemon-reload',
  docker_service: 'mkdir -p /etc/systemd/system/docker.service.d'
};
