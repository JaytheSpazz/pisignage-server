'use strict';

var express = require('express'),
    router = express.Router();

var multer = require('multer'),
    config = require('./config'),
    upload = multer({dest:config.uploadDir})

var assets = require('../app/controllers/assets'),
    playlists = require('../app/controllers/playlists'),
    players = require('../app/controllers/players'),
    groups = require('../app/controllers/groups'),
    labels = require('../app/controllers/labels'),
    licenses  = require('../app/controllers/licenses');
    //gcalAuthorize = require('../app/controllers/gcal-authorize');

/**
 * Application routes
 */

//Server Routes
// if(config.gCalendar.CLIENT_ID && config.gCalendar.CLIENT_SECRET){
//     router.get('/auth/gcal/callback', gcalAuthorize.gCalCallback)     // from Google
//     router.post('/api/gcal/authorize', gcalAuthorize.gCalAuthorize)   //from client
//}

router.get('/api/files', assets.index);
router.get('/api/files/:file', assets.getFileDetails);
router.post('/api/files', upload.fields([{name:'assets',maxCount: 10}]), assets.createFiles);
router.post('/api/postupload', assets.updateFileDetails);
router.post('/api/playlistfiles', assets.updatePlaylist);
router.post('/api/files/:file', assets.updateAsset);
router.delete('/api/files/:file', assets.deleteFile);

// router.get('/api/calendars/:file', assets.getCalendar);
// router.post('/api/calendars/:file', assets.updateCalendar);
router.delete('/api/calendars/:file', assets.deleteFile);

router.post('/api/links', assets.createLinkFile);
router.get('/api/links/:file', assets.getLinkFileDetails);

router.get('/api/playlists', playlists.index);
router.get('/api/playlists/:file', playlists.getPlaylist);
router.post('/api/playlists', playlists.createPlaylist);
router.post('/api/playlists/:file', playlists.savePlaylist);

// group routes
router.get('/api/groups', groups.index)
router.get('/api/groups/:groupid', groups.getObject)
router.post('/api/groups', groups.createObject)
router.get('/api/exportstatus', groups.getExportStatus)
router.post('/api/groups/:groupid', groups.updateObject)
router.delete('/api/groups/:groupid', groups.deleteObject)

router.param('groupid', groups.loadObject)

router.get('/api/players', players.index);
router.get('/api/players/:playerid', players.getObject)
router.post('/api/players', players.createObject)
router.post('/api/players/:playerid', players.updateObject)
router.delete('/api/players/:playerid', players.deleteObject)

router.post('/api/pishell/:playerid', players.shell)
router.post('/api/snapshot/:playerid',players.takeSnapshot)
router.post('/api/swupdate/:playerid', players.swupdate)
router.post('/api/pitv/:playerid',players.tvPower);

router.param('playerid', players.loadObject)

router.get('/api/labels', labels.index);
router.get('/api/labels/:label', labels.getObject)
router.post('/api/labels', labels.createObject);
router.post('/api/labels/:label', labels.updateObject);
router.delete('/api/labels/:label', labels.deleteObject);

require('../app/controllers/licenses').getSettingsModel(function(err,settings){
    var uploadLicense = multer({dest:(config.licenseDirPath+(settings.installation || "local"))})
    router.post('/api/licensefiles',uploadLicense.fields([{name:'assets',maxCount: 10}]),licenses.saveLicense);
})
router.get('/api/licensefiles',licenses.index);
router.delete('/api/licensefiles/:filename',licenses.deleteLicense)

router.get('/api/settings',licenses.getSettings)
router.post('/api/settings',licenses.updateSettings)

router.get('/api/serverconfig',licenses.getSettings);

router.param('label', labels.loadObject)

router.get('/loginWindow', function(req,res) {
    res.render('login', function(err,data) {
        res.send(data);
    })
})

router.get('/about',function(req,res){
    res.render('about',function(err,data){
        res.send(data);
    })
})
module.exports = router;

