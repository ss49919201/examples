package main

// O(√N)
func isPrime(n int) bool {
	if n <= 2 {
		return true
	}

	for i := 2; i * i <= n; i++ {
		if n % i == 0 {
			return false
		}
	}

	return true
}

func main() {
	for i := range 20 {
		print(i)
		print(" ")
		println(isPrime(i))
	}
}
