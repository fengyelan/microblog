/**
 * Created by yuanlan on 2015/8/21.
 */
var settings = require("../settings");
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
module.exports=new Db(settings.db,new Server(settings.host,27017),{safe:true})