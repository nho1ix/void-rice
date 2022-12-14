/**
 * @name ServerHider
 * @author DevilBro
 * @authorId 278543574059057154
 * @version 6.2.4
 * @description Allows you to hide certain Servers in your Server List
 * @invite Jx3TjNS
 * @donate https://www.paypal.me/MircoWittrien
 * @patreon https://www.patreon.com/MircoWittrien
 * @website https://mwittrien.github.io/
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/ServerHider/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Plugins/ServerHider/ServerHider.plugin.js
 */

module.exports = (_ => {
	const config = {
		"info": {
			"name": "ServerHider",
			"author": "DevilBro",
			"version": "6.2.4",
			"description": "Allows you to hide certain Servers in your Server List"
		}
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		let hiddenEles;
		
		return class ServerHider extends Plugin {
			onLoad () {
				this.defaults = {
					general: {
						onlyHideInStream:	{value: false, 	description: "Only hide selected Servers while in Streamer Mode"}
					}
				};
				
				this.patchedModules = {
					after: {
						Guilds: "type"
					}
				};
			}
			
			onStart () {
				hiddenEles = BDFDB.DataUtils.load(this, "hidden");
				
				BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.DispatchApiUtils, "dispatch", {after: e => {
					if (e.methodArguments[0].type == "STREAMER_MODE_UPDATE") BDFDB.GuildUtils.rerenderAll(true);
				}});
				
				BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.FolderStore, "getGuildFolderById", {after: e => {
					let hiddenGuildIds = hiddenEles.servers || [];
					if (e.returnValue && hiddenGuildIds.length) {
						let folder = Object.assign({}, e.returnValue);
						folder.guildIds = [].concat(folder.guildIds).filter(n => !hiddenGuildIds.includes(n));
						folder.hiddenGuildIds = [].concat(folder.guildIds).filter(n => hiddenGuildIds.includes(n));
						return folder;
					}
				}});

				BDFDB.GuildUtils.rerenderAll();
			}
			
			onStop () {
				BDFDB.GuildUtils.rerenderAll();
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
						
						for (let key in this.defaults.general) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
							type: "Switch",
							plugin: this,
							keys: ["general", key],
							label: this.defaults.general[key].description,
							value: this.settings.general[key]
						}));
				
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
							type: "Button",
							color: BDFDB.LibraryComponents.Button.Colors.RED,
							label: "Unhide all Servers/Folders",
							onClick: _ => {
								BDFDB.ModalUtils.confirm(this, "Are you sure you want to unhide all Servers and Folders?", _ => {
									BDFDB.DataUtils.save([], this, "hidden");
									BDFDB.GuildUtils.rerenderAll(true);
								});
							},
							children: BDFDB.LanguageUtils.LanguageStrings.RESET
						}));
						
						return settingsItems;
					}
				});
			}
			
			onGuildContextMenu (e) {
				if (document.querySelector(BDFDB.dotCN.modalwrapper)) return;
				if (e.type == "GuildIconNewContextMenu") {
					let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {id: "create", group: true});
					this.injectItem(e.instance, children, -1);
				}
				else {
					let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {id: "devmode-copy-id", group: true});
					this.injectItem(e.instance, children, index);
				}
			}

			onGuildFolderContextMenu (e) {
				if (document.querySelector(BDFDB.dotCN.modalwrapper)) return;
				let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {id: "devmode-copy-id", group: true});
				this.injectItem(e.instance, children, index);
			}
			
			injectItem (instance, children, index) {
				children.splice(index > -1 ? index : children.length, 0, BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
					children: [
						BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
							label: this.labels.context_serverhider,
							id: BDFDB.ContextMenuUtils.createItemId(this.name, "submenu-hide"),
							children: BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
								children: [
									BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
										label: this.labels.submenu_openhidemenu,
										id: BDFDB.ContextMenuUtils.createItemId(this.name, "openmenu"),
										action: _ => this.showHideModal()
									}),
									!instance.props.guild && !instance.props.folderId ? null : BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
										label: instance.props.guild ? this.labels.submenu_hideserver : this.labels.submenu_hidefolder,
										id: BDFDB.ContextMenuUtils.createItemId(this.name, "hide"),
										action: _ => {
											if (instance.props.guild) this.toggleItem(hiddenEles && hiddenEles.servers || [], instance.props.guild.id, "servers");
											else this.toggleItem(hiddenEles && hiddenEles.folders || [] || [], instance.props.folderId, "folders");
										}
									})
								].filter(n => n)
							})
						})
					]
				}));
			}
		
			processGuilds (e) {
				if (this.settings.general.onlyHideInStream && !BDFDB.LibraryModules.StreamerModeStore.enabled) return;
				let hiddenGuildIds = hiddenEles.servers || [];
				let hiddenFolderIds = hiddenEles.folders || [];
				if (hiddenGuildIds.length || hiddenFolderIds.length) {
					let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {props: ["folderNode", "guildNode"], someProps: true});
					if (index > -1) for (let i in children) if (children[i] && children[i].props) {
						if (children[i].props.folderNode) {
							if (hiddenFolderIds.includes(children[i].props.folderNode.id)) children[i] = null;
							else {
								let guilds = [].concat(children[i].props.folderNode.children.filter(guild => !hiddenGuildIds.includes(guild.id)));
								if (guilds.length) {
									children[i].props.hiddenGuildIds = [].concat(children[i].props.folderNode.children.filter(guild => hiddenGuildIds.includes(guild.id)));
									children[i].props.folderNode = Object.assign({}, children[i].props.folderNode, {children: guilds});
								}
								else children[i] = null;
							}
						}
						else if (children[i].props.guildNode && hiddenGuildIds.includes(children[i].props.guildNode.id)) children[i] = null;
					}
					let topBar = BDFDB.ReactUtils.findChild(e.returnvalue, {props: [["className", BDFDB.disCN.guildswrapperunreadmentionsbartop]]});
					if (topBar) {
						let topIsVisible = topBar.props.isVisible;
						topBar.props.isVisible = BDFDB.TimeUtils.suppress((...args) => {
							args[2] = args[2].filter(id => !hiddenGuildIds.includes(id));
							return topIsVisible(...args) || BDFDB.LibraryModules.UnreadGuildUtils.getMentionCount(args[0]) == 0;
						}, "Error in isVisible of Top Bar in Guild List!");
					}
					let bottomBar = BDFDB.ReactUtils.findChild(e.returnvalue, {props: [["className", BDFDB.disCN.guildswrapperunreadmentionsbarbottom]]});
					if (bottomBar) {
						let bottomIsVisible = bottomBar.props.isVisible;
						bottomBar.props.isVisible = BDFDB.TimeUtils.suppress((...args) => {
							args[2] = args[2].filter(id => !hiddenGuildIds.includes(id));
							return bottomIsVisible(...args) || BDFDB.LibraryModules.UnreadGuildUtils.getMentionCount(args[0]) == 0;
						}, "Error in isVisible of Bottom Bar in Guild List!");
					}
				}
			}

			showHideModal () {
				let switchInstances = {};
				
				let hiddenGuildIds = hiddenEles && hiddenEles.servers || [];
				let hiddenFolderIds = hiddenEles && hiddenEles.folders || [];
				let guilds = BDFDB.LibraryModules.FolderStore.guildFolders.map(n => n.guildIds).flat(10).map(guildId => BDFDB.LibraryModules.GuildStore.getGuild(guildId)).filter(n => n);
				let folders = BDFDB.LibraryModules.FolderStore.guildFolders.filter(n => n.folderId);
				let foldersAdded = [];
				
				BDFDB.ModalUtils.open(this, {
					size: "MEDIUM",
					header: this.labels.modal_header,
					subHeader: "",
					contentClassName: BDFDB.disCN.listscroller,
					children: guilds.map((guild, i) => {
						let folder = folders.find(folder => folder.guildIds.includes(guild.id));
						let firstGuildInFolder = folder && !foldersAdded.includes(folder.folderId);
						if (firstGuildInFolder) foldersAdded.push(folder.folderId);
						return [
							firstGuildInFolder ? [
								!(folders.indexOf(folder) == 0 && i == 0) && BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
									className: BDFDB.disCNS.margintop4 + BDFDB.disCN.marginbottom4
								}),
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ListRow, {
									prefix: BDFDB.ReactUtils.createElement("div", {
										className: BDFDB.disCN.listavatar,
										children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.GuildComponents.BlobMask, {
											children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Clickable, {
												className: BDFDB.disCN.guildfolder,
												children: BDFDB.ReactUtils.createElement("div", {
													className: BDFDB.disCN.guildfoldericonwrapper,
													children: BDFDB.ReactUtils.createElement("div", {
														className: BDFDB.disCN.guildfoldericonwrapperexpanded,
														children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, {
															name: BDFDB.LibraryComponents.SvgIcon.Names.FOLDER,
															color: BDFDB.ColorUtils.convert(folder.folderColor, "RGB") || "var(--bdfdb-blurple)"
														})
													})
												})
											})
										})
									}),
									label: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
										children: folder.folderName || `${BDFDB.LanguageUtils.LanguageStrings.SERVER_FOLDER_PLACEHOLDER} #${folders.indexOf(folder) + 1}`
									}),
									suffix: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Switch, {
										value: !hiddenFolderIds.includes(folder.folderId),
										onChange: value => this.toggleItem(hiddenFolderIds, folder.folderId, "folders", value)
									})
								})
							] : null,
							(i > 0 || folder) && BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
								className: BDFDB.disCNS.margintop4 + BDFDB.disCN.marginbottom4
							}),
							BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ListRow, {
								prefix: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.GuildComponents.Guild, {
									className: BDFDB.DOMUtils.formatClassName(BDFDB.disCN.listavatar, folder && BDFDB.disCN.marginleft8),
									guild: guild,
									menu: false,
									tooltip: false
								}),
								label: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
									children: guild.name
								}),
								suffix: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Switch, {
									ref: instance => {if (instance) switchInstances[guild.id] = instance;},
									value: !hiddenGuildIds.includes(guild.id),
									onChange: value => this.toggleItem(hiddenGuildIds, guild.id, "servers", value)
								})
							})
						];
					}).flat(10).filter(n => n),
					buttons: [{
						contents: BDFDB.LanguageUtils.LanguageStrings.OKAY,
						color: "BRAND",
						close: true
					}, {
						contents: BDFDB.LanguageUtils.LanguageStrings.FORM_LABEL_ALL,
						color: "TRANSPARENT",
						look: "LINK",
						onClick: (modal, instance) => {
							let enabled = hiddenGuildIds.includes(guilds[0].id);
							hiddenGuildIds = [].concat(enabled ? [] : guilds.map(n => n.id));
							hiddenFolderIds = [].concat(enabled ? [] : folders.map(n => n.folderId));
							hiddenEles = {servers: hiddenGuildIds, folders: hiddenFolderIds};
							BDFDB.DataUtils.save(hiddenEles, this, "hidden");
							for (let i in switchInstances) switchInstances[i].props.value = enabled;
							BDFDB.ReactUtils.forceUpdate(BDFDB.ObjectUtils.toArray(switchInstances));
							BDFDB.GuildUtils.rerenderAll(true);
						}
					}]
				});
			}
			
			toggleItem (array, id, type, force) {
				if (!id) return;
				if (force || (force === undefined && array.includes(id))) BDFDB.ArrayUtils.remove(array, id, true);
				else array.push(id);
				hiddenEles = Object.assign({}, hiddenEles, {[type]: array});
				BDFDB.DataUtils.save(hiddenEles, this, "hidden");
				BDFDB.GuildUtils.rerenderAll(true);
			}

			setLabelsByLanguage () {
				switch (BDFDB.LanguageUtils.getLanguage().id) {
					case "bg":		// Bulgarian
						return {
							context_serverhider:				"???????????????? ???? ??????????????",
							modal_header:						"???????????????????? ???? ?????????????????? ????????????",
							submenu_hidefolder:					"???????????????? ???? ??????????????",
							submenu_hideserver:					"???????????????? ???? ??????????????",
							submenu_openhidemenu:				"???????????????????? ???? ?????????????????? ????????????"
						};
					case "da":		// Danish
						return {
							context_serverhider:				"Server synlighed",
							modal_header:						"Administration af serverliste",
							submenu_hidefolder:					"Skjul mappe",
							submenu_hideserver:					"Skjul server",
							submenu_openhidemenu:				"Administrer serverliste"
						};
					case "de":		// German
						return {
							context_serverhider:				"Serversichtbarkeit",
							modal_header:						"Serverlistenverwaltung",
							submenu_hidefolder:					"Ordner ausblenden",
							submenu_hideserver:					"Server ausblenden",
							submenu_openhidemenu:				"Serverliste verwalten"
						};
					case "el":		// Greek
						return {
							context_serverhider:				"?????????????????? ????????????????????",
							modal_header:						"???????????????????? ???????????? ??????????????????????",
							submenu_hidefolder:					"???????????????? ??????????????",
							submenu_hideserver:					"???????????????? ????????????????????",
							submenu_openhidemenu:				"???????????????????? ???????????? ??????????????????????"
						};
					case "es":		// Spanish
						return {
							context_serverhider:				"Visibilidad del servidor",
							modal_header:						"Gesti??n de la lista de servidores",
							submenu_hidefolder:					"Ocultar carpeta",
							submenu_hideserver:					"Ocultar servidor",
							submenu_openhidemenu:				"Administrar lista de servidores"
						};
					case "fi":		// Finnish
						return {
							context_serverhider:				"Palvelimen n??kyvyys",
							modal_header:						"Palvelinluettelon hallinta",
							submenu_hidefolder:					"Piilota kansio",
							submenu_hideserver:					"Piilota palvelin",
							submenu_openhidemenu:				"Hallitse palvelinluetteloa"
						};
					case "fr":		// French
						return {
							context_serverhider:				"Visibilit?? du serveur",
							modal_header:						"Gestion de la liste des serveurs",
							submenu_hidefolder:					"Masquer le dossier",
							submenu_hideserver:					"Masquer le serveur",
							submenu_openhidemenu:				"G??rer la liste des serveurs"
						};
					case "hr":		// Croatian
						return {
							context_serverhider:				"Vidljivost poslu??itelja",
							modal_header:						"Upravljanje popisom poslu??itelja",
							submenu_hidefolder:					"Sakrij mapu",
							submenu_hideserver:					"Sakrij poslu??itelj",
							submenu_openhidemenu:				"Upravljanje popisom poslu??itelja"
						};
					case "hu":		// Hungarian
						return {
							context_serverhider:				"Szerver l??that??s??ga",
							modal_header:						"Szerverlista kezel??se",
							submenu_hidefolder:					"Mappa elrejt??se",
							submenu_hideserver:					"Szerver elrejt??se",
							submenu_openhidemenu:				"Szerverlista kezel??se"
						};
					case "it":		// Italian
						return {
							context_serverhider:				"Visibilit?? del server",
							modal_header:						"Gestione dell'elenco dei server",
							submenu_hidefolder:					"Nascondi cartella",
							submenu_hideserver:					"Nascondi server",
							submenu_openhidemenu:				"Gestisci elenco server"
						};
					case "ja":		// Japanese
						return {
							context_serverhider:				"????????????????????????",
							modal_header:						"??????????????????????????????",
							submenu_hidefolder:					"?????????????????????",
							submenu_hideserver:					"?????????????????????",
							submenu_openhidemenu:				"??????????????????????????????"
						};
					case "ko":		// Korean
						return {
							context_serverhider:				"?????? ?????????",
							modal_header:						"?????? ?????? ??????",
							submenu_hidefolder:					"?????? ?????????",
							submenu_hideserver:					"?????? ?????????",
							submenu_openhidemenu:				"?????? ?????? ??????"
						};
					case "lt":		// Lithuanian
						return {
							context_serverhider:				"Serverio matomumas",
							modal_header:						"Serveri?? s??ra??o tvarkymas",
							submenu_hidefolder:					"Sl??pti aplank??",
							submenu_hideserver:					"Sl??pti server??",
							submenu_openhidemenu:				"Tvarkyti serveri?? s??ra????"
						};
					case "nl":		// Dutch
						return {
							context_serverhider:				"Zichtbaarheid van de server",
							modal_header:						"Serverlijst beheren",
							submenu_hidefolder:					"Verberg map",
							submenu_hideserver:					"Verberg server",
							submenu_openhidemenu:				"Beheer serverlijst"
						};
					case "no":		// Norwegian
						return {
							context_serverhider:				"Server synlighet",
							modal_header:						"Administrere serverliste",
							submenu_hidefolder:					"Skjul mappe",
							submenu_hideserver:					"Skjul server",
							submenu_openhidemenu:				"Administrer serverliste"
						};
					case "pl":		// Polish
						return {
							context_serverhider:				"Widoczno???? serwera",
							modal_header:						"Zarz??dzanie list?? serwer??w",
							submenu_hidefolder:					"Ukryj folder",
							submenu_hideserver:					"Ukryj serwer",
							submenu_openhidemenu:				"Zarz??dzaj list?? serwer??w"
						};
					case "pt-BR":	// Portuguese (Brazil)
						return {
							context_serverhider:				"Visibilidade do servidor",
							modal_header:						"Gerenciando a lista de servidores",
							submenu_hidefolder:					"Ocultar pasta",
							submenu_hideserver:					"Esconder Servidor",
							submenu_openhidemenu:				"Gerenciar lista de servidores"
						};
					case "ro":		// Romanian
						return {
							context_serverhider:				"Vizibilitatea serverului",
							modal_header:						"Gestionarea listei serverelor",
							submenu_hidefolder:					"Ascunde??i dosarul",
							submenu_hideserver:					"Ascunde??i serverul",
							submenu_openhidemenu:				"Gestiona??i lista serverelor"
						};
					case "ru":		// Russian
						return {
							context_serverhider:				"?????????????????? ??????????????",
							modal_header:						"???????????????????? ?????????????? ????????????????",
							submenu_hidefolder:					"???????????? ??????????",
							submenu_hideserver:					"???????????? ????????????",
							submenu_openhidemenu:				"???????????????????? ?????????????? ????????????????"
						};
					case "sv":		// Swedish
						return {
							context_serverhider:				"Servers synlighet",
							modal_header:						"Hantera serverlista",
							submenu_hidefolder:					"D??lj mapp",
							submenu_hideserver:					"D??lj server",
							submenu_openhidemenu:				"Hantera serverlista"
						};
					case "th":		// Thai
						return {
							context_serverhider:				"???????????????????????????????????????????????????????????????",
							modal_header:						"?????????????????????????????????????????????????????????????????????????????????",
							submenu_hidefolder:					"????????????????????????????????????",
							submenu_hideserver:					"?????????????????????????????????????????????",
							submenu_openhidemenu:				"????????????????????????????????????????????????????????????????????????"
						};
					case "tr":		// Turkish
						return {
							context_serverhider:				"Sunucu G??r??n??rl??????",
							modal_header:						"Sunucu Listesini Y??netme",
							submenu_hidefolder:					"Klas??r?? Gizle",
							submenu_hideserver:					"Sunucuyu Gizle",
							submenu_openhidemenu:				"Sunucu Listesini Y??netin"
						};
					case "uk":		// Ukrainian
						return {
							context_serverhider:				"?????????????????? ??????????????",
							modal_header:						"?????????????????? ?????????????? ????????????????",
							submenu_hidefolder:					"?????????????? ??????????",
							submenu_hideserver:					"?????????????? ????????????",
							submenu_openhidemenu:				"?????????????????? ?????????????? ????????????????"
						};
					case "vi":		// Vietnamese
						return {
							context_serverhider:				"Hi???n th??? M??y ch???",
							modal_header:						"Qu???n l?? danh s??ch m??y ch???",
							submenu_hidefolder:					"???n th?? m???c",
							submenu_hideserver:					"???n m??y ch???",
							submenu_openhidemenu:				"Qu???n l?? danh s??ch m??y ch???"
						};
					case "zh-CN":	// Chinese (China)
						return {
							context_serverhider:				"??????????????????",
							modal_header:						"?????????????????????",
							submenu_hidefolder:					"???????????????",
							submenu_hideserver:					"???????????????",
							submenu_openhidemenu:				"?????????????????????"
						};
					case "zh-TW":	// Chinese (Taiwan)
						return {
							context_serverhider:				"??????????????????",
							modal_header:						"?????????????????????",
							submenu_hidefolder:					"???????????????",
							submenu_hideserver:					"???????????????",
							submenu_openhidemenu:				"?????????????????????"
						};
					default:		// English
						return {
							context_serverhider:				"Server Visibility",
							modal_header:						"Managing Server List",
							submenu_hidefolder:					"Hide Folder",
							submenu_hideserver:					"Hide Server",
							submenu_openhidemenu:				"Manage Server List"
						};
				}
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();