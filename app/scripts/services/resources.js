kinoulinkApp
.factory("apiResource",
    ["$resource", function($resource)
    {
        function transformResponse(data, header)
        {
            var wrapped = angular.fromJson(data);

            return wrapped.data;
        }

        return function(uri, paramDefaults)
        {
            var actions = {
                query: {
                    isArray: true,
                    transformResponse: transformResponse
                },
                get: {
                    transformResponse: transformResponse
                },
                save : {
                    params : {id : 'create'},
                    method: 'POST'
                }

            };

            return $resource(appConfig.api + uri, paramDefaults, actions);
        }
    }
])
.factory('Device', ['apiResource',
    function(apiResource){
        return apiResource('device/:id', {id:'@id'});
    }]
)
.factory('Playlist', ['apiResource',
    function(apiResource){
        return apiResource('playlist/:id', {id:'@id'});
    }]
)
.factory('MediaInPlaylist', ['apiResource',
    function(apiResource){
        return apiResource('mediainplaylist/:id', {id:'@id'});
    }]
)


.factory('DeviceAction', ['apiResource',
    function(apiResource){
        return apiResource('deviceaction/:id', {id:'@id'});
    }]
);