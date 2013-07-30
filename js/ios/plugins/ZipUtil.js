/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
console.log('loaded the ziputil script'); 
cordova.define("cordova/plugin/ziputil", function(require, exports, module) 
{
 	var exec = require('cordova/exec');
	console.log('executing creation ziputil service');
	function ZipUtil() {
		this.serviceName = "ZipUtil";
	}

	ZipUtil.prototype.unzip = function(successCallBack, failureCallback, sourcePath, targetFolder) {
		exec(successCallBack, failureCallback, this.serviceName, "unzip", [sourcePath, targetFolder]);
	}

	var ziputil = new ZipUtil();
	module.exports = ziputil;

});
