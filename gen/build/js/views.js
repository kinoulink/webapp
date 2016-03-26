angular.module("kinoulink").run(["$templateCache", function($templateCache) {$templateCache.put("about.html","<div class=\"container\">\n    <div class=\"panel-form\">\n        <h3>A propos de kinoulink</h3>\n\n\n    </div>\n</div>\n<style>\n    p {text-align: justify}\n</style>");
$templateCache.put("device.html","<div class=\"container\">\n\n    <h2>Ma KinouTV {{ device.token }}</h2>\n\n    <h3>Média</h3>\n\n    <div class=\"panel-form\">\n\n        <div ng-show=\"device.media.length == 0\">\n            <div class=\"alert alert-info\">\n                Pas de média ;-(\n            </div>\n        </div>\n\n        <a class=\"btn btn-primary\" href=\"#/devices/{{ device.token }}/media/add\">Ajouter un média</a>\n\n        <hr />\n\n        <table class=\"table\">\n            <thead>\n            <tr>\n                <th>\n                    Intitulé\n                </th>\n                <th>\n\n                </th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"media in device.media\">\n                    <td>{{ media.data.name }}</td>\n                    <td>\n                        <a href=\"#\" ng-click=\"removeMedia(media._id)\" title=\"Enlever le média\" class=\"fa fa-ambulance\"></a>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n\n    </div>\n\n    <h3>Actions</h3>\n\n    <div class=\"panel-form\">\n\n        <div class=\"row\">\n\n            <div class=\"col-sm-3\">\n                <a class=\"btn btn-danger btn-block\" ng-click=\"sendAction(\'off\')\">Eteindre l\'écran</a>\n            </div>\n\n            <div class=\"col-sm-3\">\n                <a class=\"btn btn-success btn-block\" ng-click=\"sendAction(\'on\')\">Allumer l\'écran</a>\n            </div>\n\n            <div class=\"col-sm-3\">\n                <a class=\"btn btn-default btn-block\" ng-click=\"sendAction(\'action3\')\">Action 3</a>\n            </div>\n\n            <div class=\"col-sm-3\">\n                <a class=\"btn btn-default btn-block\" ng-click=\"sendAction(\'action4\')\">Action 4</a>\n            </div>\n\n        </div>\n\n        <hr />\n\n        <table class=\"table\">\n            <thead>\n            <tr>\n                <th>\n                    Action\n                </th>\n                <th>\n                    Date\n                </th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr ng-repeat=\"instruction in device.instructions\">\n                <td>{{ instruction.action }}</td>\n                <td>{{ instruction.timestamp }}</td>\n            </tr>\n            </tbody>\n        </table>\n\n    </div>\n\n    <h3>Modifier</h3>\n\n    <div class=\"panel-form\">\n\n        <a class=\"btn btn-danger\" ng-click=\"detach()\">Enlever la KinouTV</a>\n\n    </div>\n\n</div>\n");
$templateCache.put("deviceMediaAdd.html","<div class=\"container\">\n\n    <h2>Ma KinouTV {{ device }}</h2>\n\n    <h3>Ajouter un média</h3>\n\n    <div class=\"panel-form\">\n\n        <div ng-show=\"medias.length == 0\">\n            <div class=\"alert alert-info\">\n                Pas de média dans votre bibliothèque ;-(\n            </div>\n        </div>\n\n        <table class=\"table\">\n            <thead>\n                <tr>\n                    <th>\n                        Intitulé\n                    </th>\n                    <th>\n\n                    </th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"media in medias\">\n                    <td>{{ media.data.name }}</td>\n                    <td class=\"text-right\">\n                        <a ng-click=\"addMedia(media)\" class=\"btn btn-success\">Ajouter</a>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n\n    </div>\n\n</div>\n");
$templateCache.put("devices.html","<div class=\"container\">\n\n    <h2>Mes KinouTV</h2>\n\n    <div class=\"panel-form\">\n        <a class=\"device-list-item\" ng-repeat=\"device in devices\" ng-href=\"#/devices/{{ device.device }}\">\n            <i class=\"fa fa-tablet\"></i>\n            <h4>{{ device.device }}</h4>\n        </a>\n    </div>\n\n    <h2>Ajouter</h2>\n\n    <form class=\"panel-form\" ng-submit=\"add()\">\n\n        <div class=\"row\">\n            <div class=\"col-sm-6\">\n                <input ng-model=\"add.code\" type=\"text\" placeholder=\"Code\" class=\"form-control\" />\n            </div>\n            <div class=\"col-sm-6\">\n                <input type=\"submit\" class=\"btn btn-success\" />\n            </div>\n        </div>\n\n    </form>\n\n</div>\n");
$templateCache.put("home.html","<div class=\"container\" ng-show=\"linkedin_contacts==null\">\n\n    <h2>Bonjour {{user.login}},</h2>\n\n    <h2>Bienvenue sur votre espace Kinoulink </h2>\n\n\n</div>\n");
$templateCache.put("me_profile.html","<div class=\"container\">\n    <div class=\"container-center-lg\">\n\n        <h3>Informations</h3>\n\n        <form class=\"form-horizontal panel-form\" ng-submit=\"submitDetails()\">\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputFirstname\">Prénom <i class=\"required\"></i></label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.name.first\" class=\"form-control\" id=\"inputFirstname\">\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputLastname\">Nom <i class=\"required\"></i></label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.name.last\" class=\"form-control\" id=\"inputLastname\">\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\">Type d\'affichage</label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <label><input type=\"radio\" name=\"pseudo\" value=\"a\" ng-model=\"user.name.mode\"/>\n                        {{pseudo_type.a}}</label>\n                    <label><input type=\"radio\" name=\"pseudo\" value=\"b\" ng-model=\"user.name.mode\"/>\n                        {{pseudo_type.b}}</label>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputEmail\">Adresse eMail <i class=\"required\"></i></label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.email\" class=\"form-control\" id=\"inputEmail\">\n                    <span class=\"text-muted\">(Votre adresse eMail ne sera jamais affichée ou transmise)</span>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputJob\">Profession <i class=\"required\"></i></label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.job\" class=\"form-control\" id=\"inputJob\">\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputSector\">Secteur d\'activité ou\n                    entreprise <i class=\"required\"></i></label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.sector\" class=\"form-control\" id=\"inputSector\">\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputAge\">Age</label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.age\" class=\"form-control\" id=\"inputAge\">\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputCity\">Ville</label>\n\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.city\" class=\"form-control\" id=\"inputCity\">\n                </div>\n            </div>\n            <div class=\"text-center\">\n                <button class=\"btn btn-success\" type=\"submit\">Enregistrer</button>\n            </div>\n        </form>\n\n        </div>\n\n        <h3>Facturation</h3>\n\n        <div class=\"panel-form\">\n            <p class=\"text-muted\">Facturation ...</p>\n        </div>\n\n        <br/>\n        <br/>\n\n    </div>\n</div>");
$templateCache.put("media.html","<div class=\"container\">\n\n    <h2>Mes Média</h2>\n\n    <div class=\"device-list-item\" ng-repeat=\"media in medias\">\n        <i class=\"fa fa-tablet\"></i>\n        <h4>{{ media.data.name }}</h4>\n    </div>\n\n    <h2>Ajouter</h2>\n\n    <form ng-submit=\"add()\">\n\n        <button ng-file-select=\"onFileSelect($files)\" class=\"btn btn-success\">Sélectionner une vidéo ou photo ..\n        </button>\n        <br/>\n\n        <div class=\"clearfix text-center\">\n            <div class=\"progress\" ng-show=\"uploadProgress > 0\">\n                <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\"\n                     ng-style=\"{ \'width\' : uploadProgress + \'%\' }\">\n                    <span class=\"sr-only\">{{uploadProgress}}% Complete</span>\n                </div>\n            </div>\n        </div>\n\n    </form>\n\n</div>\n");
$templateCache.put("auth/forgot-password.html","<br />\n<br />\n<div class=\"container\">\n    <div class=\"container-center\">\n\n        <div ng-class=\"{\'panel-form\' : true, loading: loading}\">\n\n            <h3>Mot de passe oublié</h3>\n\n            <form ng-show=\"step==1\" class=\"form-horizontal\" autocomplete=\"true\" ng-submit=\"submitLink()\">\n                <div class=\"alert alert-info\">\n                    kinoulink va vous envoyer par eMail un lien pour réinitialiser votre mot de passe.\n                </div>\n                <div class=\"__ig\">\n                    <label>Adresse eMail:</label>\n                    <input type=\"email\" name=\"email\" spellcheck=\"false\" ng-model=\"email\" class=\"form-control\" placeholder=\"Adresse eMail\">\n                </div>\n                <br />\n                <div class=\"row text-center\">\n                    <button class=\"btn btn-success\" type=\"submit\">Envoyer un eMail</button>\n                </div>\n            </form>\n\n            <form ng-show=\"step==2\" class=\"form-horizontal\" autocomplete=\"false\" ng-submit=\"submitPassword()\">\n                <div ng-show=\"email_sent\" class=\"alert alert-success\">\n                    Un eMail avec un code pour confirmer votre adresse eMail vous a été envoyé !\n                </div>\n                <div class=\"__ig\">\n                    <label>Code sécurité:</label>\n                    <input type=\"text\" spellcheck=\"false\" ng-model=\"entry.code\" class=\"form-control\">\n                </div>\n                <div class=\"__ig\">\n                    <label>Nouveau mot de passe:</label>\n                    <input type=\"password\" spellcheck=\"false\" ng-model=\"entry.password\" class=\"form-control\">\n                </div>\n                <br />\n                <div class=\"row text-center\">\n                    <button class=\"btn btn-success\" type=\"submit\">Réinitialiser mon mot de passe</button>\n                </div>\n            </form>\n\n            <hr />\n            <div class=\"text-center\">\n                <p>Pas encore de compte kinoulink ?</p>\n                <a class=\"btn btn-default\" ng-href=\"#/register\">Inscrivez vous gratuitement</a>\n            </div>\n\n        </div>\n    </div>\n</div>");
$templateCache.put("auth/login.html","<div class=\"container\">\n	<div class=\"container-center\">\n\n		<div class=\"panel-form\">\n\n			<h3>Se connecter à kinoulink</h3>\n\n			<form id=\"loginForm\" class=\"form-horizontal\" autocomplete=\"true\" ng-submit=\"doLogin()\" onsubmit=\"return false\">\n				<div class=\"__ig\">\n					<i class=\"fa fa-user\"></i>\n					<input type=\"text\" name=\"login\" spellcheck=\"false\" ng-model=\"username\" class=\"form-control\" ng-focus=\"onInputFocus()\" placeholder=\"Login\">\n				</div>\n				<div class=\"__ig\">\n					<i class=\"fa fa-unlock-alt\"></i>\n					<input type=\"password\" name=\"password\" ng-model=\"password\" class=\"form-control\" ng-focus=\"onInputFocus()\" placeholder=\"Mot de passe\">\n				</div>\n				<div class=\"row text-center\">\n					<div class=\"col-sm-6\">\n						<button class=\"btn btn-success\" type=\"submit\">Se connecter</button>\n					</div>\n					<div class=\"col-sm-6\">\n						<a class=\"btn btn-link\" ng-href=\"#/forgot-password\">Mot de passe oublié ?</a>\n					</div>\n				</div>\n			</form>\n			<hr />\n			<div class=\"text-center\">\n				<p>Pas encore de compte kinoulink ?</p>\n				<p>Contactez notre service depuis notre site <a href=\"http://kinoulink.com\" target=\"_blank\">http://kinoulink.com</a></p>\n			</div>\n\n		</div>\n	</div>\n</div>");
$templateCache.put("auth/register.html","<div class=\"container\">\n    <div ng-class=\"{\'panel-form\' : true, \'loading\': loading}\">\n        <h3><i class=\"fa fa-child\"></i> Créer son compte kinoulink</h3>\n\n        <form id=\"registerForm\" class=\"form-horizontal\" ng-submit=\"doRegister()\" ng-hide=\"loading\" onsubmit=\"return false\">\n\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputFirstname\">Login <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"user.login\" class=\"form-control\" id=\"inputFirstname\" ng-focus=\"onInputFocus()\">\n                </div>\n            </div>\n\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-md-3 control-label\" for=\"inputPassword\">Mot de passe <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"password\" ng-model=\"user.password\" ng-show=\"sso==null\" class=\"form-control\" id=\"inputPassword\" ng-focus=\"onInputFocus()\">\n                </div>\n            </div>\n\n            <div class=\"text-center\">\n                <button class=\"btn btn-success\" type=\"submit\">Enregistrer</button>\n                <span class=\"text-muted\">(* Champs obligatoires)</span>\n            </div>\n        </form>\n        <hr />\n        <p class=\"text-center\">\n            <a ng-href=\"#/login\">Déjà un compte kinoulink ?</a>\n        </p>\n    </div>\n    <br />\n</div>");
$templateCache.put("directives/loader.html","<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             width=\"110px\" height=\"64px\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n<path d=\"M16 16 L29.85640646055102 24 L29.85640646055102 40 L16 48 L2.1435935394489807 40 L2.1435935394489807 24z\" fill=\"#ddd\" opacity=\"0.2\">\n  <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; 0.2\" begin=\"0.2s\" dur=\"1s\" keyTimes=\"0;0.01;1\" repeatCount=\"indefinite\" />\n</path>\n <path d=\"M56 16 L69.85640646055101 24 L69.85640646055101 40 L56 48 L42.14359353944898 40 L42.14359353944898 24z\" fill=\"#ddd\" opacity=\"0.2\">\n  <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; 0.2\" begin=\"0.5s\" dur=\"1s\" keyTimes=\"0;0.01;1\" repeatCount=\"indefinite\" />\n</path>\n <path d=\"M96 16 L109.85640646055101 24 L109.85640646055101 40 L96 48 L82.14359353944899 40 L82.14359353944899 24z\" fill=\"#ddd\" opacity=\"0.2\">\n  <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; 0.2\" begin=\"0.75s\" dur=\"1s\" keyTimes=\"0;0.05;1\" repeatCount=\"indefinite\" />\n</path>\n</svg>");
$templateCache.put("directives/restaurants_book.html","<div>\n    <textarea class=\"form-control\" placeholder=\"Lieu personnalisé...\" ng-model=\"place_custom\"></textarea>\n    <div class=\"text-right gap-v-1\">\n        <input type=\"button\" value=\"Ok\" class=\"btn btn-default\" ng-click=\"selectCustomPlace()\" />\n    </div>\n</div>\n\n<div class=\"text-embossed\">Ou</div>\n\n<div class=\"__search\">\n    <input type=\"text\" class=\"form-control\" placeholder=\"Rechercher\" ng-model=\"search\" ng-model-options=\"{ debounce: 600 }\">\n</div>\n\n<div class=\"book-group clearfix\" style=\"margin: 20px 0\">\n    <a ng-repeat=\"item in restaurants\" ng-click=\"onRestaurantClick(item)\" class=\"book-contact clearfix\">\n        <span class=\"__t\">{{item.title}}</span>\n        <span>{{item.address.street}}, {{item.address.city}}</span>\n        <span class=\"__r label label-primary\">{{item.location | distance}}</span>\n    </a>\n</div>");
$templateCache.put("event/create.html","<div class=\"bg-info section heading\">\n    <div class=\"container clearfix\">\n        <i class=\"fa fa-glass\"></i>\n        <span>Evènement</span>\n        <p>Participez à un évènement ..... rencontrez ... échangez .....</p>\n    </div>\n</div>\n<div class=\"container\" ng-show=\"step==1 || step==2\">\n    <div ng-class=\"{\'panel-form\' : true, \'loading\': step==2}\">\n        <h4><i class=\"fa fa-glass\"></i> Créer un évènement kinoulink</h4>\n        <form id=\"registerForm\" class=\"form-horizontal\" ng-submit=\"doSave()\" ng-hide=\"loading\" onsubmit=\"return false\" method=\"post\">\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputTitle\">Intitulé <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" ng-model=\"event.title\" class=\"form-control\" id=\"inputTitle\" required>\n                </div>\n            </div>\n            <hr />\n            <h4>Début</h4>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-sm-2 control-label\" for=\"inputDateStart\">Date <i class=\"required\"></i></label>\n                <div class=\"col-sm-4 col-md-4\">\n                    <input type=\"date\" ng-model=\"event.start_date\" class=\"form-control\" id=\"inputDateStart\" required>\n                </div>\n                <label class=\"col-sm-2 col-sm-2 control-label\" for=\"inputTimeStart\">Heure <i class=\"required\"></i></label>\n                <div class=\"col-sm-4 col-md-4\">\n                    <input type=\"time\" ng-model=\"event.start_time\" class=\"form-control\" id=\"inputTimeStart\" required>\n                </div>\n            </div>\n            <hr />\n            <h4>Fin</h4>\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 col-xs-2 control-label\" for=\"inputDateEnd\">Date <i class=\"required\"></i></label>\n                <div class=\"col-sm-4 col-md-4\">\n                    <input type=\"date\" ng-model=\"event.end_date\" class=\"form-control\" id=\"inputDateEnd\" required>\n                </div>\n                <label class=\"col-sm-2 col-sm-2 control-label\" for=\"inputTimeEnd\">Heure <i class=\"required\"></i></label>\n                <div class=\"col-sm-4 col-md-4\">\n                    <input type=\"time\" ng-model=\"event.end_time\" class=\"form-control\" id=\"inputTimeEnd\" required>\n                </div>\n            </div>\n            <hr />\n            <h4>Addresse</h4>\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputAddress\">Rue <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" name=\"street\" ng-model=\"event.address_street\" class=\"form-control\" id=\"inputAddress\" required>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputCodepost\">Code postal <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" name=\"codepost\" ng-model=\"event.address_codepost\" class=\"form-control\" id=\"inputCodepost\" required>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <label class=\"col-md-3 col-sm-2 control-label\" for=\"inputCity\">Ville <i class=\"required\"></i></label>\n                <div class=\"col-sm-10 col-md-9\">\n                    <input type=\"text\" name=\"city\" ng-model=\"event.address_city\" class=\"form-control\" id=\"inputCity\" required>\n                </div>\n            </div>\n            <div class=\"form-group text-center\">\n                <input type=\"submit\" class=\"btn btn-success\" value=\"Créer\" />\n            </div>\n        </form>\n    </div>\n    <br />\n</div>");
$templateCache.put("event/event.html","<div class=\"bg-info section heading\">\n    <div class=\"container clearfix\">\n        <i class=\"fa fa-glass\"></i>\n        <span>Evènement</span>\n        <p>Participez à un évènement ..... rencontrez ... échangez .....</p>\n    </div>\n</div>\n<div class=\"section section-action\">\n    <div class=\"container\">\n        Nouveau sur kinoulink\n        <a class=\"pull-right btn btn-primary\" ng-href=\"/#/event/create\">Créer un évènement</a>\n    </div>\n</div>\n<div class=\"container\">\n    <h3>Evènements</h3>\n    <div>\n        <div class=\"panel-form\" ng-repeat=\"event in events\">\n            <h3>{{event.title}}</h3>\n            <p>Commence le {{event.date.start | formatDateVerbose}} et fini le {{event.date.end | formatDateVerbose}}</p>\n            <p>{{event.address.street}}, {{event.address.city}}</p>\n            <div class=\"text-right\">\n                <a ng-href=\"/#/event/{{event.id}}\">Voir l\'évènement</a>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("event/viewer.html","<div class=\"bg-info section heading\">\n    <div class=\"container clearfix text-center\">\n        <h1>{{event.title}}</h1>\n    </div>\n</div>\n<div class=\"section\" style=\"background: #ddd; color: #333\">\n    <div class=\"container text-center\">\n        <div class=\"row\">\n            <div class=\"col-sm-6\">\n                <span class=\"__a\">Indiquez votre précence</span>\n            </div>\n            <div class=\"col-sm-6\">\n                <button ng-disabled=\"loading\" ng-show=\"user_presence==1\" class=\"btn btn-primary\" ng-click=\"clockIn()\">Je suis à cet évènement</button>\n                <button ng-disabled=\"loading\" ng-show=\"user_presence==2\" class=\"btn btn-warning\" ng-click=\"clockOut()\">Je ne suis plus à cet évènement</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"section\">\n    <div class=\"container\">\n        <h2>Participants</h2>\n\n        <div class=\"__u\" ng-repeat=\"user in users\">\n            <bz-presence bz-user=\"user\"></bz-presence>\n\n            <a ng-href=\"#/u/{{user.id}}\" class=\"_t\">{{user.title}}</a>\n            <span>{{user.job}} {{user.sector}}</span>\n            <span>{{user.status}}</span>\n\n            <div>\n                <button ng-click=\"startConversation(user)\" class=\"btn btn-success\">Rencontrer</button>\n            </div>\n\n            <a ng-href=\"#/u/{{user.id}}\"><img class=\"_a\" ng-src=\"{{user.avatar}}\" /></a>\n        </div>\n\n    </div>\n</div>");
$templateCache.put("me/emails.html","<div class=\"container\">\n\n    <h2>eMails envoyés par kinoulink</h2>\n\n    <div class=\"panel-form\">\n        <table class=\"table\" style=\"width: 100%\">\n            <tr ng-repeat=\"email in emails | orderBy:\'date\':\'reverse\'\" style=\"height: 38px\">\n                <td>\n                    <strong>{{email.template}}</strong>\n                </td>\n                <td>\n                    {{email.date | formatDateVerbose}}, {{email.date | formatTime}}\n                </td>\n            </tr>\n        </table>\n    </div>\n\n</div>");}]);