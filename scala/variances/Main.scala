@main
def f(): Unit = {
  println(1)
}

// Scalaには型パラメータを持つクラスを定義できる。このクラスをジェネリッククラスという。
class G[A](a: A) {}

// 型パラメータを+Aのように書くと型パラメータ、クラスは共変になる。
// 型パラメータが共変のジェネリッククラスG[+A]がありT、Sという型がありTがSのサブタイプ、すなわち継承しているクラスの時、
// G[T]はG[S]のサブタイプであると解釈される。G[S] = G[T]の代入が成立する。
class S {}
class T extends S {}

var g: G[T] = new G(new T())
// Required: G[S] var f: G[S] = g

class G2[+A](a: A) {}
var g2: G2[T] = new G2(new T()) 
var f2: G2[S] = g2

// 型パラメータを-Aのように書くと型パラメータ、クラスは反変になる。
// 上記コメントと同じ状況の場合、G[T]、G[S]の関係はT、Sの関係と反対になる。
class G3[-A](a: A) {}
var g3: G3[S] = new G3(new S())
var f3: G3[T] = new G3(new T())
