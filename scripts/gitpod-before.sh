#!/bin/bash

# Gitpod-enhanced has some ENHANCED issues.

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

source "$HOME/.sdkman/bin/sdkman-init.sh"

nvm install 
nvm use


      [[ ! -z $WAKATIME_API_KEY_64  ]] 
      cd ~ 
      echo $WAKATIME_API_KEY_64 | base64 -d > ~/.wakatime.cfg 
      mkdir -p ~/.ssh 
      [[ ! -z $SSH_PUBLIC_KEY  ]] 
      echo $SSH_PUBLIC_KEY > ~/.ssh/id_rsa.pub 
      chmod 644 ~/.ssh/id_rsa.pub 
      [[ ! -z $SSH_PRIVATE_KEY  ]] 
      echo $SSH_PRIVATE_KEY | base64 -d > ~/.ssh/id_rsa 
      chmod 600 ~/.ssh/id_rsa 
      [[ ! -z $GITCONFIG  ]] 
      echo $GITCONFIG | base64 -d > ~/.gitconfig 
      chmod 644 ~/.gitconfig 
      git config --global --unset gpg.program 
      git config --global --unset core.editor 
      git config --global --unset safe.directory 
      [[ ! -z $GNUPG_KEY  ]] 
      cd ~ 
      rm -rf .gnupg 
      gpg --verbose --batch --import <(echo $GNUPG_KEY|base64 -d) 
      echo 'pinentry-mode loopback' >> ~/.gnupg/gpg.conf 
      git config --global user.signingkey $GPG_KEY_ID 
      git config --global commit.gpgsign true