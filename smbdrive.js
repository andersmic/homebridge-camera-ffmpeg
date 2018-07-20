var debug = require('debug')('CameraDrive');
var SMB2 = require('smb2');
var dateFormat = require('dateformat');

module.exports = {
    drive: drive
}

function drive(share, domain, username, password) {
    this.share = share;
    this.domain = domain;
    this.username = username;
    this.password = password;
    debug('Drive init: ' + this.share);
}

drive.prototype.storePicture = function(prefix, picture) {
    // create an SMB2 instance
   debug('Samba init: ' + this.share);
   var smb2Client = new SMB2(
        {
            share: this.share,
            domain: this.domain, 
            username: this.username,
            password: this.password
        });
    
    // get folder ID
    debug("mkdir");
    var folder = 'homebridge-camera/' + prefix.replace(/ /g, "_");

    smb2Client.mkdir(folder, function (err) {
        if (err) {
            console.log('Error creating folder');
        }
        else {
            console.log('Folder created!');
        }

        debug("upload");
        var now = new Date();
        var d = dateFormat(now, 'yyyymmdd-HHMMss')
        var name = d + ".jpeg";
    
        smb2Client.writeFile(folder + '/' + name, picture, function (err2) {
            if (err2) {
                console.log('Error creating file ' + name);
                console.log(err2);
            } 
            else {
                console.log('Snapshot saved. Filename: ' + name);
            }
        });
    });

}
