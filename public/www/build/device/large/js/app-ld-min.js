Ns.GameHome={GAME_VIEW_HTML:"game-view-ld.html",GAME_VIEW_B_HTML:"game-view-b-ld.html",GAME_WATCH_HTML:"game-watch-ld.html",contactsMatchKey:function(){return Ns.view.UserProfile.appUser.id+":CONTACTS_MATCH_KEY"},groupMatchKey:function(a){return Ns.view.UserProfile.appUser.id+":GROUP_MATCH_KEY_PREFIX:"+a},tournamentMatchKey:function(a){return Ns.view.UserProfile.appUser.id+":TOURNAMENT_MATCH_KEY_PREFIX:"+a},showGameView:function(a){document.getElementById("home-game-panel").innerHTML=Ns.ui.UI.gameViewHtml;
Ns.GameView.Content(a)},showGameViewB:function(a){Main.dialog.show({title:"Play Robot",content:Ns.ui.UI.gameSettings(a.game_name),fade:!0,buttons:["Cancel","Play"],closeButton:!1,modal:!0,action:function(d,b){"Play"===b&&(document.getElementById("home-game-panel").innerHTML=Ns.ui.UI.gameViewBHtml,document.getElementById("game-view-b-bluetooth-icon").style.display="none",Ns.GameViewB.Content(a));this.hide()}})},showGameWatch:function(a){document.getElementById("home-game-panel").innerHTML=Ns.ui.UI.gameWatchHtml;
Ns.GameWatch.Content(a)},Content:function(a){Ns.ui.UI.init(a);(function(){function a(){c.style.position="absolute";c.style.top=0;c.style.bottom=0;Main.device.isXLarge()?(b.style.width="25%",c.style.position="absolute",c.style.top=0,c.style.bottom=0,c.style.left=b.style.width,c.style.width="75%"):(b.style.width="40%",c.style.position="absolute",c.style.top=0,c.style.bottom=0,c.style.left=b.style.width,c.style.width="60%")}var b=document.getElementById("home-main"),c=document.getElementById("home-game-panel");
a();Main.dom.removeListener(window,"orientationchange",a);Main.dom.addListener(window,"orientationchange",a)})()},showBluetoothGame:function(a){var d=.3*window.innerWidth;Main.dialog.show({title:"Play via bluetooth",content:'\x3cdiv id\x3d"bluetooth-dialog-continer"\x3e\x3c/div\x3e',width:300>d?300:d,height:.5*window.screen.height,fade:!0,closeButton:!1,modal:!0,buttons:["Cancel"],action:function(a,c){"Cancel"===c&&this.hide()},onShow:function(){var b=this;Ns.game.Bluetooth.start({data:a,container:"bluetooth-dialog-continer",
onReady:function(a){document.getElementById("home-game-panel").innerHTML=Ns.ui.UI.gameViewBHtml;document.getElementById("game-view-b-bluetooth-icon").style.display="block";Ns.GameViewB.Content(a);b.hide()}})}})},showTournamentDetails:function(a){Main.card.to({container:"#home-main",url:"tournament-details-ld.html",fade:!0,data:a,onShow:Ns.view.Tournament.content})},showGroupDetails:function(a){Main.card.to({container:"#home-main",url:"group-details-ld.html",fade:!0,data:a,onShow:Ns.view.Group.content})},
showPlayNotifications:function(a){Main.card.to({container:"#home-main",url:"play-notifications-ld.html",fade:!0,data:a,onShow:Ns.view.PlayNotifications.content})},showInvitePlayers:function(a){},showContacts:function(a){Main.card.to({container:"#home-main",url:"contacts-ld.html",fade:!0,data:a,onShow:Ns.view.Contacts.content})},showCreateGroup:function(a){},showCreateTournament:function(a){},showUserProfile:function(a){Main.card.to({container:"#home-main",url:"user-profile-ld.html",fade:!0,data:a,
onShow:Ns.view.UserProfile.content})},showSettings:function(a){},showHelp:function(a){}};
Main.on("pagecreate",function(a){$("#game-select-chess").on("click",function(){Main.page.show({url:"game-home-ld.html",effect:"fade",duration:500,onBeforeShow:Ns.GameHome.Content,data:{game:"chess"}})});$("#game-select-draft").on("click",function(){Main.page.show({url:"game-home-ld.html",effect:"fade",duration:500,onBeforeShow:Ns.GameHome.Content,data:{game:"draft"}})});$("#game-select-ludo").on("click",function(){Main.page.show({url:"game-home-ld.html",effect:"fade",duration:500,onBeforeShow:Ns.GameHome.Content,
data:{game:"ludo"}})});$("#game-select-solitaire").on("click",function(){Main.page.show({url:"game-home-ld.html",effect:"fade",duration:500,onBeforeShow:Ns.GameHome.Content,data:{game:"solitaire"}})});$("#game-select-whot").on("click",function(){Main.page.show({url:"game-home-ld.html",effect:"fade",duration:500,onBeforeShow:Ns.GameHome.Content,data:{game:"whot"}})})});
Ns.GameView={leftPanelTitleComp:null,afterLeftContentHide:function(){Ns.GameView.leftPanelTitleComp&&(Ns.GameView.leftPanelTitleComp.innerHTML="")},showLeftContent:function(a){if(Main.device.isXLarge()){var d=document.getElementById("game-view-main");d.style.width="60%";var b=document.getElementById("game-view-right-content");b.style.width="40%";b.style.display="block";(b=Ns.ui.GamePanel.gameAreaDimension(d))&&Ns.GameView.resizeMain(b.board_size,b.upper_height,b.lower_height);a()}else b=document.getElementById("game-view-right-content"),
b.style.width="65%",b.style.right="-65%",b.style.display="block",a(),Main.anim.to("game-view-right-content",500,{right:"0%"})},hideLeftContent:function(){if(Main.device.isXLarge()){document.getElementById("game-view-main").style.width="100%";var a=document.getElementById("game-view-right-content");a.style.display="none";Ns.GameView.afterLeftContentHide()}else a=document.getElementById("game-view-right-content"),"0%"===a.style.right&&(a.style.display="block",Main.anim.to("game-view-right-content",
500,{right:"-65%"},Ns.GameView.afterLeftContentHide))},resizeMain:function(a,d,b){var c=document.getElementById("game-view-main-board"),e=document.getElementById("game-view-main-upper"),f=document.getElementById("game-view-main-lower");c.style.width=a+"px";c.style.height=a+"px";e.style.width=c.style.width;e.style.height=d+"px";f.style.width=c.style.width;f.style.height=b+"px"},Content:function(a){var d=document.getElementById("game-view-main"),b=document.getElementById("game-view-right-content");
Ns.ui.GamePanel.ownGameView(a,d,Ns.GameView.resizeMain,function(){Main.device.isXLarge()?(this.element.style.width="60%",this.element.style.height="100%",b.style.width="40%",b.style.right="0%",b.style.display="block"):(this.element.style.width="100%",this.element.style.height="100%",b.style.width="65%",b.style.display="block",b.style.right="-"+b.style.width,Ns.GameView.afterLeftContentHide())})}};
Ns.GameViewB={leftPanelTitleComp:null,afterLeftContentHide:function(){Ns.GameViewB.leftPanelTitleComp&&(Ns.GameViewB.leftPanelTitleComp.innerHTML="")},showLeftContent:function(a){if(Main.device.isXLarge()){var d=document.getElementById("game-view-b-main");d.style.width="60%";var b=document.getElementById("game-view-b-right-content");b.style.width="40%";b.style.display="block";(b=Ns.ui.GamePanel.gameAreaDimension(d))&&Ns.GameViewB.resizeMain(b.board_size,b.upper_height,b.lower_height);a()}else b=document.getElementById("game-view-b-right-content"),
b.style.width="65%",b.style.right="-65%",b.style.display="block",a(),Main.anim.to("game-view-b-right-content",500,{right:"0%"})},hideLeftContent:function(){if(Main.device.isXLarge()){document.getElementById("game-view-b-main").style.width="100%";var a=document.getElementById("game-view-b-right-content");a.style.display="none";Ns.GameViewB.afterLeftContentHide()}else a=document.getElementById("game-view-b-right-content"),"0%"===a.style.right&&(a.style.display="block",Main.anim.to("game-view-b-right-content",
500,{right:"-65%"},Ns.GameViewB.afterLeftContentHide))},resizeMain:function(a,d,b){var c=document.getElementById("game-view-b-main-board"),e=document.getElementById("game-view-b-main-upper"),f=document.getElementById("game-view-b-main-lower");c.style.width=a+"px";c.style.height=a+"px";e.style.width=c.style.width;e.style.height=d+"px";f.style.width=c.style.width;f.style.height=b+"px"},Content:function(a){var d=document.getElementById("game-view-b-main"),b=document.getElementById("game-view-b-right-content");
Ns.ui.GamePanel.ownGameViewB(a,d,Ns.GameViewB.resizeMain,function(){Main.device.isXLarge()?(this.element.style.width="60%",this.element.style.height="100%",b.style.width="40%",b.style.right="0%",b.style.display="block"):(this.element.style.width="100%",this.element.style.height="100%",b.style.width="65%",b.style.display="block",b.style.right="-"+b.style.width,Ns.GameViewB.afterLeftContentHide())})}};
Ns.GameWatch={leftPanelTitleComp:null,afterLeftContentHide:function(){Ns.GameWatch.leftPanelTitleComp&&(Ns.GameWatch.leftPanelTitleComp.innerHTML="",Ns.GameWatch.isShowLeftPanel=!1)},showLeftContent:function(a){if(Main.device.isXLarge()){var d=document.getElementById("game-watch-main");d.style.width="60%";var b=document.getElementById("game-watch-right-content");b.style.width="40%";b.style.display="block";(b=Ns.ui.GamePanel.gameAreaDimension(d))&&Ns.GameWatch.resizeMain(b.board_size,b.upper_height,
b.lower_height);a()}else d=document.getElementById("game-watch-main"),d.style.width="100%",b=document.getElementById("game-watch-right-content"),b.style.width="65%",b.style.right="-65%",b.style.display="block",a(),Main.anim.to("game-watch-right-content",500,{right:"0%"});Ns.GameWatch.isShowLeftPanel=!0},hideLeftContent:function(){if(Main.device.isXLarge()){document.getElementById("game-watch-main").style.width="100%";var a=document.getElementById("game-watch-right-content");a.style.display="none";
Ns.GameWatch.afterLeftContentHide()}else a=document.getElementById("game-watch-right-content"),"0%"===a.style.right&&(a.style.display="block",Main.anim.to("game-watch-right-content",500,{right:"-65%"},Ns.GameWatch.afterLeftContentHide))},resizeMain:function(a,d,b){var c=document.getElementById("game-watch-main-board"),e=document.getElementById("game-watch-main-upper"),f=document.getElementById("game-watch-main-lower");c.style.width=a+"px";c.style.height=a+"px";e.style.width=c.style.width;e.style.height=
d+"px";f.style.width=c.style.width;f.style.height=b+"px"},Content:function(a){var d=document.getElementById("game-watch-main"),b=document.getElementById("game-watch-right-content");Ns.ui.GamePanel.watchGame(a,d,Ns.GameWatch.resizeMain,function(){Main.device.isXLarge()?(this.element.style.width="60%",this.element.style.height="100%",b.style.width="40%",b.style.right="0%",b.style.display="block"):(this.element.style.width="100%",this.element.style.height="100%",b.style.width="65%",b.style.display="block",
b.style.right="-"+b.style.width,Ns.GameWatch.afterLeftContentHide())})}};