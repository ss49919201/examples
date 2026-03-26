import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.diagrams.Diagrams
import org.scalatest.concurrent.TimeLimits
import org.mockito.Mockito._
import org.scalatest.time.SpanSugar._

class UserSpec extends AnyFlatSpec with Diagrams with TimeLimits {
  val user = new User

  "int" should "引数の整数をそのまま返すことができる" in {
    assert(user.int(1) == 1)
  }

  it should "1秒以内に処理できる" in {
    failAfter(1000.millis) {
      user.int(2)
    }
  }

  it should "mockを使うことができる" in {
    val mockUser = mock(classOf[User])
    when(mockUser.int(1)).thenReturn(2)
    assert(mockUser.int(1) == 2)
  }
}
