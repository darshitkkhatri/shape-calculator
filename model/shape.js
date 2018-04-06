function Shape() {
    this.shape_list = ['circle', 'square', 'rectangle', 'eclipse'];
    this.shape_params = {'circle' :['diameter'], 'square':['width'], 'rectangle':['width','height'], 'eclipse':['width','height']};

    this.create_shape = function (name, params) {
        if(name === 'circle'){
            return new Circle(params['diameter'])
        }else if(name === 'square'){
            return new Square(params['width'])
        }else if(name === 'rectangle'){
            return new Rectangle(params['width'], params['height'])
        }else if(name === 'eclipse'){
            return new Eclipse(params['width'], params['height'])
        }
    }
}

function Circle(diameter) {
    this.diameter = diameter;
    this.params = ['diameter']
    this.area = function () {
        return (1/4) * Math.pow(this.diameter, 2) * Math.PI;
    }
}
function Square(width) {
    this.width = width;
    this.params = ['width']
    this.area = function () {
        return Math.pow(this.width, 2);
    }
}
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    this.params = ['width', 'height'];
    this.area = function () {
        return this.width * this.height;
    }
}
function Eclipse(width, height) {
    this.width = width;
    this.height = height;
    this.params = ['width', 'height'];
    this.area = function () {
        return Math.PI * this.width * this.height;
    }
}

module.exports = Shape;