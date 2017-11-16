class Frac{
    static gcd(m,n){
        return (m %= n) ? Frac.gcd(n, m) : n;
    }
    constructor(num, den){
        if(num instanceof Frac){
            den = num.den;
            num = num.num;
        }
        this.num = num || 0;
        this.den = den || 1;
        this.reduce();
    }
    str(){
        var s = this.num;
        if(this.den!=1) s += "/" + this.den;
        return s;
    }
    reduce(){
        var x = Frac.gcd(this.num, this.den);
        this.num /= x;
        this.den /= x;
        return this;
    }
    add(x){
        x = new Frac(x);
        this.num = this.num * x.den + x.num * this.den;
        this.den *= x.den;
        this.reduce();
        return this;
    }
    sub(x){
        x = new Frac(x);
        this.num = this.num * x.den - x.num * this.den;
        this.den *= x.den;
        this.reduce();
        return this;
    }
    mul(x){
        x = new Frac(x);
        this.num *= x.num;
        this.den *= x.den;
        this.reduce();
        return this;
    }
    div(x){
        x = new Frac(x);
        if (x.num==0) throw "div error";
        this.num *= x.den;
        this.den *= x.num;
        this.reduce();
        return this;
    }
}

/* 文字列から行列へ */
var str2mat = str => 
    str.split('\n').filter(x => x!="").map(
        line => line.split(' ').filter(x => x!="").map(x => parseInt(x))
    );

/* 行列からHTML(table)へ */
var mat2html = m => "<table>" +m.map(row => "<tr>" + row.map(x => "<td>" + x.str() + "</td>").join('') + "</tr>").join('') + "</table>";

/* 行基本変形 */
var row_operations = function(mat){
    mat = mat.map(x => x.map(x => new Frac(x)));
    var r_size = mat.length;
    if(r_size === 0) return [[]];
    var c_size = Math.min.apply(this, mat.map(r => r.length));
    var pivot = 0;
    for (var c_index = 0; c_index < c_size; c_index++){
        var vec = mat.map(r => r[c_index]);
        var ind = pivot;
        while(ind < r_size && vec[ind].num==0) ind++;
        if(ind==r_size) continue;
        var val = vec[ind];
        /* 行の入れ替え */ 
        var tmp = mat[ind];
        mat[ind] = mat[pivot];
        mat[pivot] = tmp;
        /* 主成分を1にする */
        mat[pivot] = mat[pivot].map(x => new Frac(x).div(val));
        /* それぞれの要素をk倍して引く */
        for(var r_index = 0; r_index < r_size; r_index++){
            if(r_index == pivot) continue;    
            val = mat[r_index][pivot];
            mat[r_index] = mat[r_index].map((x, i) => new Frac(x).sub(new Frac(mat[pivot][i]).mul(val)));
        }
        if(++pivot == r_size) break;
    }
    return mat;
};