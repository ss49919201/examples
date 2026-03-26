class User {
  def int(i: Int): Int = i

  def error(): Unit = throw new RuntimeException("error!")
}
