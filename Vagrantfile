# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = true
    vb.memory = "2048"
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y --no-install-recommends build-essential ubuntu-desktop
    apt-get install -y virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11
    reboot
  SHELL
end
