import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.util.{Failure, Success}

trait Foo {
  def bar: Unit
}

object foo extends Foo {
  def bar: Unit = {}
}

@main
def main(): Unit = {
  val f: Future[String] = Future {
    Thread.sleep(1000)
    println("execute f")
    "Wake up!"
  }
  val f2: Future[String] = Future {
    Thread.sleep(100)
    println("execute f2")
    "Wake up!"
  }

  val composite = for {
    a <- f
    b <- f2
  } yield (a, b)
  composite onComplete {
    case Success(s) => println(s)
    case Failure(t) => println(t.getMessage)
  }
  Await.ready(f, 3000.seconds)
  println("Done!")
}
