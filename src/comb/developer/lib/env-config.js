const dev_config = {
  dockerRegistryUrl: '192.168.32.10:5001'
};

const pro_config = {
  dockerRegistryUrl: 'dockerhub.yonyoucloud.com'
};

let config = pro_config;

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'location'){
  config = dev_config;
}

export default config;



export const myRp_envObj = {
  proEnv: {
    InstallingType1: "curl https://developer.yonyoucloud.com/download/install-agent -o /tmp/install-agent && bash /tmp/install-agent ",
    InstallingType2: "curl https://developer.yonyoucloud.com/download/external/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh "
  },
  noProEnv: {
    InstallingType1: "curl -sS -L http://172.20.18.183/download/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh ",
    InstallingType2: "curl -sS -L http://172.20.18.183/download/external/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh "
  },

};

export const myRp_info = {
    dev_sh: 'curl https://developer.yonyoucloud.com/download/docker|sh',
    dev_conf:'curl https://developer.yonyoucloud.com/download/docker.conf -o /etc/systemd/system/docker.service.d/docker.conf',
    daemon:'systemctl daemon-reload',
    docker_enable:'sudo systemctl enable docker',
    docker_start:'sudo systemctl restart docker',
    docker_reload:'sudo systemctl daemon-reload',
    docker_service:'mkdir -p /etc/systemd/system/docker.service.d',
    docker_ssh:'docker-machine ssh',
    add_bash:'tce-load -wi bash.tcz',
    edit_profile:"sudo sed -i '4c\--insecure-registry=0.0.0.0/0' /var/lib/boot2docker/profile",
    docker_restart:'sudo /etc/init.d/docker restart',
    all1:'mkdir -p /etc/systemd/system/docker.service.d\ncurl https://developer.yonyoucloud.com/download/docker.conf -o /etc/systemd/system/docker.service.d/docker.conf' +
    '\nsudo systemctl daemon-reload\nsudo systemctl enable docker\nsudo systemctl restart docker',
    all2:"docker-machine ssh\ntce-load -wi bash.tcz\nsudo sed -i '4c--insecure-registry=0.0.0.0/0' /var/lib/boot2docker/profile\nsudo /etc/init.d/docker restart",
}


export const myRp_proLink = {
  'env': "developer.yonyoucloud.com"
};


