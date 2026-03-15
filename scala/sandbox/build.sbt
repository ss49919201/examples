ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.3.4"

lazy val root = (project in file("."))
  .settings(
    name := "untitled"
  )

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest-flatspec" % "3.2.19" % "test",
  "org.scalatest" %% "scalatest-diagrams" % "3.2.19" % "test",
)
