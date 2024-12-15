#include <stdio.h>
#include "calc.h"
#include "showResult.h"

int main(int argc, char** argv) {
	int result = sum(1, 2);
	showResult(result);
	return 0;
}
