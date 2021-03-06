//META{"name":"hideChannels"}*//

/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.\nJust reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!\nJust reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

class hideChannels {
	constructor() {
		this.hidChannels = {
			chans: []
		};

		this.mo = new MutationObserver((changes, z) => {
			changes.forEach((change, i) => {
				if(change.addedNodes)
					change.addedNodes.forEach((node) => {
						if(node.className != undefined && node.className === 'containerDefault-7RImuF')
							this.hideChannel();
					});
			});
		});
	};

	hideChannel() {
		if(!this.hidChannels.chans[0]) {
			$('.channels-wrap [class*="containerDefault-7RImuF"]').each(function() {
				if($(this).css('display') === 'none') $(this).show();
			});
			return console.warn('%c[hideChannelsPerServer]%c\tNo channels found.', 'color: #F2F', '');
		} 
		else {
			for(const chan of this.hidChannels.chans) {
				$(`.containerDefault-7RImuF:contains(${chan})`).hide();
			}
		}
	};

	chanPush() {
		const newChan = $('#ChanblockField').val();
		if(typeof newChan !== 'string') return $('#ChanblockField').val('Invalid entry.');
		if(!newChan || newChan === undefined) return $('#ChanblockField').val('Invalid entry.');
		this.hidChannels.chans.push(newChan);
		console.info(`%c[${this.getName()}]%c\t${this.hidChannels.chans.join(', ')}`, 'color: #F2F', '');
		this.hideChannel();
	};
	
	chanClear() {
		const oldChan = $('#ChanblockField').val();
		if(this.hidChannels.chans.length !== 0) {
			if(oldChan.match(/^\w{1,}$/)) {
				this.hidChannels.chans.splice(this.hidChannels.chans.indexOf(oldChan), 1);
				console.info(`%c[${this.getName()}]%c\t${this.hidChannels.chans.join(', ')}`, 'color: #F2F', '');
				alert('Successfully removed!');
				this.hideChannel();
			}
			else {
				this.hidChannels.chans.pop();
				console.info(`%c[${this.getName()}]%c\t${this.hidChannels.chans.join(', ')}`, 'color: #F2F', '');
				alert('Successfully removed!');
				this.hideChannel();
			}
		}
		else
			return console.info(`%c[${this.getName()}]%c\tNo channels to remove.`, 'color: #F2F', '');
	};

	saveSettings(save) {
		bdPluginStorage.set('hideChannels', 'chans', JSON.stringify(this.hidChannels.chans));
		save = true;
		console.info('%c[hideChannels]%c\tSaved settings.', 'color: #F2F', '');
		console.info('%c[hideChannels]%c\t' + this.hidChannels.chans.join(', '), 'color: #F2F', '');
	};

	loadSettings() {
		this.hidChannels.chans = JSON.parse(bdPluginStorage.get('hideChannels', 'chans'));
		console.info('%c[hideChannels]%c\tLoaded settings.', 'color: #F2F', '');
		console.info('%c[hideChannels]%c\t' + this.hidChannels.chans.join(', '), 'color: #F2F', '');
	};

	start() {
		console.info('%c[hideChannels]%c\tWorking...', 'color: #F2F', '');
		var settings = bdPluginStorage.get('hideChannels', 'chans');
		if(settings === null) {
			console.info('%c[hideChannels]%c\tNo settings found.', 'color: #F2F', '');
		}
		else {
			this.hidChannels.chans = JSON.parse(settings);
			console.info('%c[hideChannels]%c\t' + this.hidChannels.chans.join(', '), 'color: #F2F', '');
		}
		this.hideChannel();
		this.observe();
	};

	observe() {
		if(!$('.scroller-NXV0-d') || !$('.scroller-NXV0-d').length) return;
		this.mo.observe($('.scroller-NXV0-d')[0], {childList: true, subtree: true});
	}

	observer({ addedNodes, removedNodes }) {
		if(addedNodes && addedNodes[0] && addedNodes[0].classList && addedNodes[0].classList.contains('messages-wrapper')
		|| addedNodes && addedNodes[0] && addedNodes[0].classList && addedNodes[0].classList.contains('containerDefault')) {
			this.mo.disconnect();
			this.hideChannel();
			this.observe();
		}
	}

	stop() {
		this.mo.disconnect();
		$('.channels-wrap [class*="containerDefault-7RImuF"]').each(function() {
			if($(this).css('display') === 'none') $(this).show();
		});
		console.info('%c[hideChannels]%c\tStopped.', 'color: #F2F', '');
	};

	load() { 
		console.info('%c[hideChannels]%c\tBooting-Up.', 'color: #F2F', '');
	};

	getAuthor() {
		return 'Arashiryuu';
	};

	getName() {
		return 'hideChannels';
	};

	getVersion() {
		return '1.4';
	};

	getDescription() {
		return 'Hides any channels listed in the array of names.';
	};

	getSettingsPanel() { 
		let htmls = '<h3>hideChannels Plugin</h3><br/>'; 
		htmls += '<input id="ChanblockField" type="text" placeholder="Name" style="resize: none; width: 80%;" /><br/><br/>';
		htmls += '<br/><button class="ChU-btn0" onclick=BdApi.getPlugin("'+ this.getName() +'").chanPush()>apply</button>';
		htmls += '<button class="ChU-btn1" onclick=BdApi.getPlugin("'+ this.getName() +'").chanClear()>remove</button>';
		htmls += '<button class="ChU-btn2" onclick=BdApi.getPlugin("'+ this.getName() +'").saveSettings()>save</button>';
		htmls += '<button class="ChU-btn3" onclick=BdApi.getPlugin("'+ this.getName() +'").loadSettings()>load</button><br/>';
		htmls += '<br/>How to use:';
		htmls += '<br/>1) Insert a channel\'s name.<br/>';
		htmls += '2) Click "apply."<br/>';
		htmls += '3) To remove the last-added channel, click the "remove" button.<br/>';
		return htmls;
	};
};

/*@end*/
