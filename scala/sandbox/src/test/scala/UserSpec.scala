import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.diagrams.Diagrams

class UserSpec extends AnyFlatSpec with Diagrams {
  val user = new User

  "int" should "引数の整数をそのまま返すことができる" in {
    assert(user.int(1) == 1)
  }
}
