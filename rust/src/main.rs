fn main() {
    rec(10);
}

fn rec(n: i32) {
    if n == 0 {
        return;
    }
    println!("{}", n);
    rec(n - 1);
}
