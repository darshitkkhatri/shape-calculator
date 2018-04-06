var url = require('url');
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var querystring = require('querystring');
var shape = require('./model/shape');
var shapefac = new shape();

function renderHTML(path, response) {
    fs.readFile(path[0], null, function (err, data) {
        if(err){
            response.writeHead('404');
            response.write('File not found');
        }
        else{
            response.write(render_handlebar(data, path[1]));
        }
        response.end();
    });
}

function render_handlebar(source, data) {
    var template = handlebars.compile(source.toString());
    return template(data);
}

module.exports = {
    handleRequest : function (request, response) {
        var POST = '';
        var GET = '';
        response.writeHead('200',{'Content-type':'text/html'});
        var paths = url.parse(request.url).pathname;
        var file_extension = path.extname(paths);
        if(file_extension === '.gif'){
            response.writeHead(200,{'Content-type':'image/gif'});
            
            fs.readFile('.'+paths, null, function (err, data) {
                if(err){
                    response.writeHead('404');
                    response.write('File not found');
                }
                else{
                        response.write(data);
                }
                response.end();
            });
        }
        else {
            switch (paths) {
                case '/':
                    var shapes = shapefac.shape_list;
                    renderHTML(['./ui/template/index.html',{'shapes':shapes}], response);
                    break;
                case '/step2':
                    if(request.method=='POST') {
                        var body='';
                        request.on('data', function (data) {
                            body +=data;
                        });
                        request.on('end',function(){
                            POST =  querystring.parse(body);
                            renderHTML(['./ui/template/step2.html',{'shape':POST['shape'], 'shapes_param':shapefac.shape_params[POST['shape']]}], response);
                        });
                    }
                    break;
                case '/step3':
                    if(request.method=='POST') {
                        var body='';
                        request.on('data', function (data) {
                            body +=data;
                        });
                        request.on('end',function(){
                            POST =  querystring.parse(body);
                            var shape_params = shapefac.shape_params[POST['shape']];
                            var params = [];
                            var params_value = [];
                            for(i = 0 ; i < shape_params.length ; i++){
                                params[shape_params[i]] = POST[shape_params[i]];
                                params_value[i] = POST[shape_params[i]];
                            }
                            var new_shape = shapefac.create_shape(POST['shape'],params);
                            var area = new_shape.area();
                            renderHTML(['./ui/template/step3.html',{'shape':POST['shape'], 'shapes_param':shape_params, 'shapes_param_value':params_value, 'area':area}], response);
                        });
                    }
                    break;
                default:
                    response.writeHead('404');
                    response.write('Route not Found');
                    response.end();
            }
        }
    }
}