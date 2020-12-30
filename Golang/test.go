package main

import "fmt"

func main() {
	s := []string{1: "A", "B", "C", "D", "E"}
	s1 := s[1:2]
	fmt.Println(s, s1, s1[0:5])
}
