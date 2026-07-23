export type LanguageId = "c" | "java" | "python" | "sql";
export type ExamType = "written" | "practical";
export type Importance = "high" | "medium" | "low";

export type StudyContent =
  | { type: "text"; value: string }
  | { type: "code"; language: string; value: string }
  | { type: "result"; value: string }
  | { type: "warning"; title?: string; value: string }
  | { type: "memory"; value: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type StudyTopic = {
  id: string;
  title: string;
  examTypes: ExamType[];
  importance: Importance;
  summary: string;
  contents: StudyContent[];
};

export type LanguageStudyData = {
  id: LanguageId;
  name: string;
  description: string;
  coreTopics: string[];
  writtenImportance: Importance;
  practicalImportance: Importance;
  topics: StudyTopic[];
  mustMemorize: string[];
  commonMistakes: string[];
};

export type ProgrammingStudyProgress = {
  completed: Record<LanguageId, string[]>;
  recentLanguage: LanguageId | null;
};

export const PROGRAMMING_STUDY_STORAGE_KEY =
  "jeongcheogi_programming_study_progress_v1";

export const LANGUAGE_ORDER: LanguageId[] = ["c", "java", "python", "sql"];

const operatorPrecedenceRows = [
  ["1", "괄호", "( )", "(2 + 3) * 4 = 20"],
  ["2", "단항·증감", "+x, -x, !x, ~x, ++, --", "-(-3) = 3"],
  ["3", "곱셈·나눗셈·나머지", "*, /, %", "10 + 6 / 2 = 13"],
  ["4", "덧셈·뺄셈", "+, -", "8 - 3 + 2 = 7"],
  ["5", "시프트", "<<, >>", "1 + 2 << 2 = 12"],
  ["6", "크기 비교", "<, <=, >, >=", "3 + 2 > 4 = true"],
  ["7", "동등 비교", "==, !=", "3 < 4 == true = true"],
  ["8", "비트 AND", "&", "6 & 3 = 2"],
  ["9", "비트 XOR", "^", "6 ^ 3 = 5"],
  ["10", "비트 OR", "|", "6 | 3 = 7"],
  ["11", "논리 AND", "&&", "true && false = false"],
  ["12", "논리 OR", "||", "false || true = true"],
  ["13", "대입", "=, +=, -=, ...", "x = 3 + 2 → 5"],
];

const c: LanguageStudyData = {
  id: "c",
  name: "C언어",
  description: "메모리와 실행 순서를 직접 추적하는 실기 빈출 언어",
  coreTopics: ["포인터", "배열", "연산자", "문자열", "구조체", "재귀함수"],
  writtenImportance: "high",
  practicalImportance: "high",
  topics: [
    {
      id: "c-types-io",
      title: "자료형, 입출력과 형 변환",
      examTypes: ["written", "practical"],
      importance: "high",
      summary: "자료형의 범위와 서식 지정자가 맞아야 값을 올바르게 읽고 출력한다.",
      contents: [
        { type: "table", headers: ["자료형", "용도", "대표 서식"], rows: [["char", "문자·작은 정수", "%c"], ["short / int / long", "정수", "%hd / %d / %ld"], ["float", "단정도 실수", "%f"], ["double", "배정도 실수", "printf: %f, scanf: %lf"], ["unsigned int", "0 이상의 정수", "%u"], ["문자열(char 배열)", "널 문자로 끝나는 문자열", "%s"]] },
        { type: "text", value: "printf는 값을 출력하고 scanf는 입력값을 변수의 주소에 저장한다. scanf(\"%d\", &n)처럼 일반 변수에는 &가 필요하지만 문자 배열을 %s로 받을 때 배열 이름 자체가 주소이므로 &를 쓰지 않는다." },
        { type: "code", language: "c", value: "int a = 7, b = 2;\nprintf(\"%d %.1f\\n\", a / b, (double)a / b);" },
        { type: "result", value: "3 3.5" },
        { type: "warning", title: "시험 함정", value: "정수끼리 나누면 소수부를 버린 뒤 결과를 만든다. 결과를 double 변수에 저장해도 이미 버린 소수부는 돌아오지 않는다." },
        { type: "memory", value: "형 변환은 (자료형)값, scanf는 주소, 정수 / 정수는 정수 결과로 기억한다." },
      ],
    },
    {
      id: "c-operators",
      title: "산술·비교·논리·비트 연산자",
      examTypes: ["written", "practical"], importance: "high",
      summary: "연산 종류와 단락 평가, 비트 단위 결과를 구분한다.",
      contents: [
        { type: "table", headers: ["분류", "연산자", "핵심"], rows: [["산술", "+ - * / %", "%는 정수 나머지"], ["비교", "< <= > >= == !=", "참이면 1, 거짓이면 0"], ["논리", "&& || !", "0은 거짓, 0 이외는 참"], ["비트", "& | ^ ~ << >>", "각 비트를 직접 계산"]] },
        { type: "code", language: "c", value: "int x = 6, y = 3; // 0110, 0011\nprintf(\"%d %d %d\\n\", x & y, x | y, x ^ y);" },
        { type: "result", value: "2 7 5" },
        { type: "warning", title: "시험 함정", value: "&&와 ||는 논리 연산, &와 |는 비트 연산이다. &&와 ||는 결과가 결정되면 오른쪽 식을 실행하지 않는 단락 평가를 한다." },
      ],
    },
    {
      id: "c-precedence",
      title: "연산자 우선순위",
      examTypes: ["written", "practical"], importance: "high",
      summary: "괄호부터 대입까지의 결합 순서로 식을 단계별 계산한다.",
      contents: [
        { type: "table", headers: ["순위", "분류", "연산자", "계산 예"], rows: operatorPrecedenceRows },
        { type: "code", language: "c", value: "int x = 2 + 3 * 4;\nint y = (2 + 3) * 4;\nint z = 1 + 2 << 2;\nprintf(\"%d %d %d\\n\", x, y, z);" },
        { type: "result", value: "14 20 12" },
        { type: "memory", value: "괄호 → 단항 → 곱셈 → 덧셈 → 시프트 → 비교 → 동등 → 비트 AND·XOR·OR → 논리 AND·OR → 대입" },
      ],
    },
    {
      id: "c-increment-control",
      title: "증감 연산자와 제어문",
      examTypes: ["written", "practical"], importance: "high",
      summary: "전위·후위 차이와 조건문, 반복문의 흐름을 추적한다.",
      contents: [
        { type: "text", value: "++i는 값을 먼저 증가시킨 뒤 식에 사용하고 i++는 현재 값을 식에 사용한 뒤 증가시킨다. if·else와 switch는 분기, for·while·do while은 반복에 사용한다." },
        { type: "code", language: "c", value: "int i = 1;\nprintf(\"%d \", i++);\nprintf(\"%d\\n\", ++i);\nfor (int n = 0; n < 5; n++) {\n  if (n == 1) continue;\n  if (n == 4) break;\n  printf(\"%d \", n);\n}" },
        { type: "result", value: "1 3\n0 2 3" },
        { type: "warning", title: "시험 함정", value: "continue는 현재 반복만 건너뛰고, break는 가장 가까운 반복문 또는 switch를 끝낸다. do while은 조건이 거짓이어도 한 번 실행한다." },
      ],
    },
    {
      id: "c-arrays",
      title: "1차원·2차원 배열",
      examTypes: ["written", "practical"], importance: "high",
      summary: "인덱스는 0부터 시작하며 2차원 배열은 행 우선으로 저장된다.",
      contents: [
        { type: "code", language: "c", value: "int a[3] = {10, 20, 30};\nint m[2][3] = {{1, 2, 3}, {4, 5, 6}};\nprintf(\"%d %d\\n\", a[2], m[1][0]);" },
        { type: "result", value: "30 4" },
        { type: "text", value: "배열 이름 a는 대부분의 식에서 첫 원소의 주소 &a[0]로 변환된다. 따라서 a[i]와 *(a + i)는 같은 원소를 가리킨다." },
        { type: "warning", title: "시험 함정", value: "유효 범위 밖의 인덱스 접근은 정의되지 않은 동작이다. C는 자동으로 범위를 검사하지 않는다." },
      ],
    },
    {
      id: "c-pointers",
      title: "포인터, 포인터 연산과 이중 포인터",
      examTypes: ["written", "practical"], importance: "high",
      summary: "주소, 역참조, 자료형 크기만큼 이동하는 포인터 연산을 이해한다.",
      contents: [
        { type: "code", language: "c", value: "int values[] = {10, 20, 30};\nint *p = values;\nint **pp = &p;\nprintf(\"%d %d %d\\n\", *p, *(p + 2), **pp);" },
        { type: "result", value: "10 30 10" },
        { type: "text", value: "&x는 x의 주소, *p는 p가 가리키는 값이다. int*에서 p + 1은 주소 숫자 1이 아니라 sizeof(int)만큼 다음 원소로 이동한다. int**는 int* 변수의 주소를 저장한다." },
        { type: "memory", value: "선언의 *는 포인터형, 식의 *는 역참조, &는 주소 얻기다." },
      ],
    },
    {
      id: "c-strings",
      title: "문자열과 주요 문자열 함수",
      examTypes: ["written", "practical"], importance: "high",
      summary: "C 문자열은 끝에 널 문자 \\0을 가진 char 배열이다.",
      contents: [
        { type: "table", headers: ["함수", "기능", "주의"], rows: [["strlen(s)", "널 문자 전까지 길이", "\\0은 세지 않음"], ["strcpy(dst, src)", "문자열 복사", "dst 공간 필요"], ["strcat(dst, src)", "뒤에 연결", "dst 여유 공간 필요"], ["strcmp(a, b)", "사전식 비교", "같을 때 0"]] },
        { type: "code", language: "c", value: "char s[6] = \"Hello\";\nprintf(\"%zu %c\\n\", strlen(s), s[5] == '\\0' ? 'Y' : 'N');" },
        { type: "result", value: "5 Y" },
        { type: "warning", title: "시험 함정", value: "문자 '0'과 널 문자 '\\0'은 다르다. strcmp의 동일 결과는 1이 아니라 0이다." },
      ],
    },
    {
      id: "c-functions",
      title: "함수, 매개변수와 주소 전달",
      examTypes: ["written", "practical"], importance: "high",
      summary: "C는 값을 전달하며, 주소값을 넘기면 호출한 변수의 값을 바꿀 수 있다.",
      contents: [
        { type: "code", language: "c", value: "void addOne(int n) { n++; }\nvoid addOneByAddress(int *n) { (*n)++; }\nint x = 1;\naddOne(x);\nprintf(\"%d \", x);\naddOneByAddress(&x);\nprintf(\"%d\\n\", x);" },
        { type: "result", value: "1 2" },
        { type: "text", value: "첫 함수는 x의 복사본을 받는다. 두 번째 함수도 주소값 자체를 값으로 전달받지만, 그 주소를 역참조해 원본 x를 수정한다." },
      ],
    },
    {
      id: "c-recursion",
      title: "재귀함수",
      examTypes: ["written", "practical"], importance: "high",
      summary: "종료 조건과 호출이 되돌아오는 순서를 함께 추적한다.",
      contents: [
        { type: "code", language: "c", value: "int factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nprintf(\"%d\\n\", factorial(4));" },
        { type: "result", value: "24" },
        { type: "warning", title: "시험 함정", value: "종료 조건이 없으면 호출 스택이 계속 쌓인다. 출력문이 재귀 호출 앞인지 뒤인지에 따라 출력 순서가 반대가 될 수 있다." },
      ],
    },
    {
      id: "c-structs",
      title: "구조체와 구조체 포인터",
      examTypes: ["written", "practical"], importance: "medium",
      summary: "서로 다른 자료형을 묶고 . 또는 ->로 멤버에 접근한다.",
      contents: [
        { type: "code", language: "c", value: "struct Score { char grade; int point; };\nstruct Score s = {'A', 95};\nstruct Score *p = &s;\nprintf(\"%c %d\\n\", s.grade, p->point);" },
        { type: "result", value: "A 95" },
        { type: "memory", value: "구조체 변수.멤버, 구조체 포인터->멤버로 구분한다. p->x는 (*p).x와 같다." },
      ],
    },
    {
      id: "c-static-bits",
      title: "static 변수, 비트·시프트 연산",
      examTypes: ["written", "practical"], importance: "high",
      summary: "정적 지역 변수의 수명과 시프트 결과를 추적한다.",
      contents: [
        { type: "code", language: "c", value: "int count(void) { static int n = 0; return ++n; }\nprintf(\"%d %d\\n\", count(), count());\nprintf(\"%d %d\\n\", 5 << 1, 5 >> 1);" },
        { type: "result", value: "2 1 또는 1 2가 될 수 있음\n10 2" },
        { type: "warning", title: "시험 함정", value: "함수 인자의 평가 순서는 C에서 고정되지 않으므로 같은 printf 인자에서 count()를 두 번 호출한 출력 순서를 단정하면 안 된다. static 지역 변수는 한 번 초기화되고 호출 사이에 값을 유지한다." },
        { type: "memory", value: "양수 x << n은 범위 안에서 x × 2ⁿ, x >> n은 x ÷ 2ⁿ의 몫처럼 계산한다." },
      ],
    },
    {
      id: "c-output-traps",
      title: "실행 결과 문제의 핵심 함정",
      examTypes: ["practical"], importance: "high",
      summary: "정의된 계산만 추적하고, 부작용과 경계를 먼저 확인한다.",
      contents: [
        { type: "table", headers: ["함정", "확인할 것"], rows: [["정수 나눗셈", "피연산자의 자료형"], ["증감 연산", "사용 전·후 증가 시점"], ["배열·포인터", "현재 주소와 인덱스"], ["문자열", "널 문자 포함 여부"], ["재귀", "종료 조건과 복귀 순서"], ["형 변환", "계산 전인지 계산 후인지"], ["정의되지 않은 동작", "평가 순서 의존·범위 밖 접근 여부"]] },
        { type: "memory", value: "변수표를 만들고 문장 하나씩 실행하되, 정의되지 않은 동작은 특정 결과로 외우지 않는다." },
      ],
    },
  ],
  mustMemorize: ["scanf의 일반 변수에는 주소 연산자 &를 사용한다.", "배열 a의 a[i]는 *(a + i)와 같다.", "C 문자열은 널 문자 \\0으로 끝난다.", "구조체 포인터 멤버는 ->로 접근한다.", "static 지역 변수는 호출 사이에 값을 유지한다."],
  commonMistakes: ["정수 나눗셈 결과에 소수부가 있다고 계산하기", "strcmp가 같을 때 1이라고 생각하기", "후위 증가를 식보다 먼저 반영하기", "논리 연산자와 비트 연산자 섞기", "평가 순서가 정해지지 않은 식의 결과를 단정하기"],
};

const java: LanguageStudyData = {
  id: "java", name: "Java", description: "객체의 타입과 동적 메서드 호출을 구분하는 빈출 언어",
  coreTopics: ["상속", "오버라이딩", "생성자", "문자열 비교", "static"],
  writtenImportance: "high", practicalImportance: "high",
  topics: [
    {
      id: "java-types", title: "기본·참조 자료형과 형 변환", examTypes: ["written", "practical"], importance: "high", summary: "값 자체를 저장하는 기본형과 객체 주소를 가리키는 참조형을 구분한다.",
      contents: [
        { type: "table", headers: ["구분", "종류", "특징"], rows: [["기본 자료형", "byte, short, int, long, float, double, char, boolean", "값 자체 저장"], ["참조 자료형", "배열, 클래스, 인터페이스, String", "객체 참조 저장"]] },
        { type: "code", language: "java", value: "int n = (int) 3.9;       // 명시적 축소\ndouble d = n;           // 자동 확대\nObject obj = \"Java\";  // 업캐스팅\nString s = (String) obj;" },
        { type: "result", value: "n = 3, d = 3.0, s = \"Java\"" },
        { type: "warning", title: "시험 함정", value: "실수에서 정수로 형 변환하면 반올림하지 않고 소수부를 버린다. 호환되지 않는 참조형으로 다운캐스팅하면 ClassCastException이 발생한다." },
      ],
    },
    {
      id: "java-operators", title: "연산자와 우선순위", examTypes: ["written", "practical"], importance: "high", summary: "연산 순서와 정수 나눗셈, 단락 평가를 함께 확인한다.",
      contents: [
        { type: "table", headers: ["순위", "분류", "연산자", "계산 예"], rows: operatorPrecedenceRows },
        { type: "code", language: "java", value: "int a = 2 + 3 * 4;\nint b = (2 + 3) * 4;\nint c = 1 + 2 << 2;\nSystem.out.println(a + \" \" + b + \" \" + c);" },
        { type: "result", value: "14 20 12" },
        { type: "warning", title: "시험 함정", value: "+는 숫자 덧셈과 문자열 연결에 모두 쓰인다. 왼쪽부터 문자열이 등장하면 이후 값도 문자열로 이어진다." },
        { type: "memory", value: "괄호 → 단항 → 곱셈 → 덧셈 → 시프트 → 비교 → 동등 → 비트 AND·XOR·OR → 논리 AND·OR → 대입" },
      ],
    },
    {
      id: "java-control-arrays", title: "조건문, 반복문과 배열", examTypes: ["written", "practical"], importance: "high", summary: "분기·반복 흐름과 배열 인덱스를 추적한다.",
      contents: [
        { type: "code", language: "java", value: "int[] values = {1, 2, 3, 4};\nint sum = 0;\nfor (int value : values) {\n  if (value == 2) continue;\n  if (value == 4) break;\n  sum += value;\n}\nSystem.out.println(sum);" },
        { type: "result", value: "4" },
        { type: "text", value: "if·else와 switch는 조건에 따라 분기하고 for·향상된 for·while·do while은 반복한다. Java 배열은 생성 시 길이가 고정되며 length 필드로 길이를 확인한다." },
        { type: "warning", title: "시험 함정", value: "배열 인덱스가 범위를 벗어나면 ArrayIndexOutOfBoundsException이 발생한다. switch의 break 누락 시 다음 case도 이어서 실행될 수 있다." },
      ],
    },
    {
      id: "java-class-constructor", title: "클래스, 객체, 필드·메서드와 생성자", examTypes: ["written", "practical"], importance: "high", summary: "객체 상태는 필드, 동작은 메서드이며 생성자가 초기화를 담당한다.",
      contents: [
        { type: "code", language: "java", value: "class Box {\n  int value;\n  Box(int value) { this.value = value; }\n  int doubleValue() { return value * 2; }\n}\nBox box = new Box(5);\nSystem.out.println(box.doubleValue());" },
        { type: "result", value: "10" },
        { type: "text", value: "생성자는 클래스명과 같고 반환형을 쓰지 않는다. this는 현재 객체를 가리키며 this.value는 필드, value는 매개변수다. 생성자를 하나도 선언하지 않았을 때만 기본 생성자가 자동 제공된다." },
      ],
    },
    {
      id: "java-inheritance", title: "상속, this와 super", examTypes: ["written", "practical"], importance: "high", summary: "하위 클래스는 상위 클래스의 접근 가능한 멤버를 물려받는다.",
      contents: [
        { type: "code", language: "java", value: "class Parent {\n  Parent(int n) { System.out.print(n + \" \"); }\n}\nclass Child extends Parent {\n  Child() { super(1); System.out.print(2); }\n}\nnew Child();" },
        { type: "result", value: "1 2" },
        { type: "text", value: "super는 상위 객체 부분을, this는 현재 객체를 가리킨다. 생성자의 첫 문장은 this(...) 또는 super(...)여야 하며 생략하면 가능한 경우 super()가 삽입된다." },
        { type: "warning", title: "시험 함정", value: "상위 클래스에 매개변수 없는 생성자가 없으면 하위 생성자에서 알맞은 super(인자)를 직접 호출해야 한다." },
      ],
    },
    {
      id: "java-overload-override", title: "오버로딩과 오버라이딩", examTypes: ["written", "practical"], importance: "high", summary: "같은 이름의 새 시그니처와 상속 메서드 재정의를 구분한다.",
      contents: [
        { type: "table", headers: ["구분", "오버로딩", "오버라이딩"], rows: [["위치", "같은 클래스 중심", "상속 관계"], ["조건", "매개변수 목록이 다름", "이름·매개변수가 같음"], ["결정", "컴파일 시", "실행 시 실제 객체 기준"], ["반환형만 변경", "불가", "호환되는 공변 반환 가능"]] },
        { type: "memory", value: "오버로딩은 매개변수, 오버라이딩은 실제 객체의 메서드로 기억한다." },
      ],
    },
    {
      id: "java-dispatch", title: "참조변수 타입과 실제 객체", examTypes: ["written", "practical"], importance: "high", summary: "접근 가능한 멤버는 참조형, 오버라이딩 메서드 실행은 실제 객체가 결정한다.",
      contents: [
        { type: "code", language: "java", value: "class A { int x = 1; int value() { return 1; } }\nclass B extends A { int x = 2; @Override int value() { return 2; } }\nA obj = new B();\nSystem.out.println(obj.x + \" \" + obj.value());" },
        { type: "result", value: "1 2" },
        { type: "warning", title: "시험 함정", value: "필드는 오버라이딩되지 않아 참조변수 자료형 A의 필드가 선택된다. 메서드는 동적 바인딩되어 실제 객체 B의 재정의 메서드가 호출된다." },
      ],
    },
    {
      id: "java-string", title: "String과 ==·equals", examTypes: ["written", "practical"], importance: "high", summary: "문자열 내용 비교와 참조 비교를 구분한다.",
      contents: [
        { type: "code", language: "java", value: "String a = new String(\"hi\");\nString b = new String(\"hi\");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));" },
        { type: "result", value: "false\ntrue" },
        { type: "text", value: "==는 두 참조가 같은 객체를 가리키는지 비교하고 equals는 String의 문자 내용을 비교한다. String은 불변 객체라 메서드 결과를 받지 않으면 원본이 바뀌지 않는다." },
      ],
    },
    {
      id: "java-static-final", title: "static과 final", examTypes: ["written", "practical"], importance: "high", summary: "클래스 소속 멤버와 변경·상속 제한을 구분한다.",
      contents: [
        { type: "table", headers: ["표현", "의미"], rows: [["static 필드·메서드", "객체가 아닌 클래스에 하나 존재"], ["final 변수", "한 번 대입 후 재대입 불가"], ["final 메서드", "오버라이딩 불가"], ["final 클래스", "상속 불가"]] },
        { type: "warning", title: "시험 함정", value: "static 메서드에서는 객체 없이 인스턴스 필드나 this를 직접 사용할 수 없다. final 참조는 다른 객체를 가리킬 수 없다는 뜻이지 객체 내부가 항상 불변이라는 뜻은 아니다." },
      ],
    },
    {
      id: "java-abstraction-access", title: "추상 클래스, 인터페이스와 접근 제어자", examTypes: ["written"], importance: "high", summary: "공통 구현과 계약, 멤버 공개 범위를 설계한다.",
      contents: [
        { type: "table", headers: ["접근 제어자", "접근 범위"], rows: [["public", "모든 곳"], ["protected", "같은 패키지와 상속 관계"], ["(default)", "같은 패키지"], ["private", "같은 클래스"]] },
        { type: "text", value: "추상 클래스는 상태·생성자·일반 메서드와 추상 메서드를 함께 가질 수 있다. 인터페이스는 구현 클래스가 지켜야 할 계약이며 클래스는 여러 인터페이스를 구현할 수 있다." },
        { type: "memory", value: "접근 범위는 public > protected > default > private 순으로 좁아진다." },
      ],
    },
    {
      id: "java-exceptions", title: "예외 처리", examTypes: ["written", "practical"], importance: "medium", summary: "try·catch·finally와 throws의 흐름을 구분한다.",
      contents: [
        { type: "code", language: "java", value: "try {\n  System.out.print(10 / 0);\n} catch (ArithmeticException e) {\n  System.out.print(\"E\");\n} finally {\n  System.out.print(\"F\");\n}" },
        { type: "result", value: "EF" },
        { type: "text", value: "catch는 발생한 예외를 처리하고 finally는 정상·예외 여부와 관계없이 정리 작업을 수행한다. throw는 예외를 직접 발생시키고 throws는 호출자에게 처리 책임을 알린다." },
      ],
    },
    {
      id: "java-collections", title: "컬렉션: List, Set, Map, Stack, Queue", examTypes: ["written", "practical"], importance: "high", summary: "순서·중복·키 사용 여부에 따라 자료구조를 선택한다.",
      contents: [
        { type: "table", headers: ["자료구조", "특징", "대표 동작"], rows: [["ArrayList", "순서 있음, 중복 허용", "add, get, remove"], ["HashSet", "중복 없음, 순서 보장 안 함", "add, contains"], ["HashMap", "키-값, 키 중복 없음", "put, get"], ["Stack", "LIFO", "push, pop, peek"], ["Queue", "FIFO", "offer, poll, peek"]] },
        { type: "code", language: "java", value: "List<Integer> list = new ArrayList<>();\nlist.add(1); list.add(1);\nSet<Integer> set = new HashSet<>(list);\nSystem.out.println(list.size() + \" \" + set.size());" },
        { type: "result", value: "2 1" },
        { type: "warning", title: "시험 함정", value: "HashSet과 HashMap은 출력 순서를 보장하지 않는다. Queue의 poll은 비어 있으면 null, remove는 예외를 낼 수 있다." },
      ],
    },
    {
      id: "java-output-traps", title: "실행 결과 문제의 핵심 함정", examTypes: ["practical"], importance: "high", summary: "생성 순서, 타입, 바인딩, 문자열을 먼저 표시한다.",
      contents: [
        { type: "table", headers: ["함정", "판단 기준"], rows: [["생성자", "상위 생성자부터 실행"], ["필드", "참조변수 자료형"], ["오버라이딩 메서드", "실제 객체 자료형"], ["오버로딩", "컴파일 시 인자 타입"], ["문자열", "==는 참조, equals는 내용"], ["static", "클래스에 공유"], ["컬렉션", "순서·중복 규칙"]] },
        { type: "memory", value: "참조형과 실제 객체형을 따로 적고 필드·메서드를 각각 결정한다." },
      ],
    },
  ],
  mustMemorize: ["기본형은 값, 참조형은 객체 참조를 저장한다.", "상위 생성자가 하위 생성자보다 먼저 실행된다.", "필드는 참조형, 오버라이딩 메서드는 실제 객체형을 따른다.", "String의 내용 비교는 equals를 사용한다.", "List는 순서·중복 허용, Set은 중복 불가, Map은 키-값 구조다."],
  commonMistakes: ["생성자에 반환형 쓰기", "반환형만 바꾸면 오버로딩된다고 생각하기", "필드도 동적 바인딩된다고 생각하기", "String 내용을 ==로 비교하기", "HashSet·HashMap의 출력 순서를 가정하기"],
};

const python: LanguageStudyData = {
  id: "python", name: "Python", description: "슬라이싱과 가변 객체의 변화를 정확히 추적하는 실기 빈출 언어",
  coreTopics: ["슬라이싱", "리스트", "참조와 복사", "range", "자료구조"],
  writtenImportance: "medium", practicalImportance: "high",
  topics: [
    {
      id: "python-basics", title: "들여쓰기와 기본 자료형", examTypes: ["written", "practical"], importance: "high", summary: "들여쓰기가 블록을 결정하며 값에 따라 자료형이 정해진다.",
      contents: [
        { type: "table", headers: ["자료형", "예", "특징"], rows: [["int", "10", "임의 정밀도 정수"], ["float", "3.14", "실수"], ["str", "'abc'", "불변 문자열"], ["bool", "True, False", "논리값"]] },
        { type: "code", language: "python", value: "x = 3\nif x > 0:\n    message = 'positive'\nprint(message, type(x).__name__)" },
        { type: "result", value: "positive int" },
        { type: "warning", title: "시험 함정", value: "같은 블록은 들여쓰기 깊이가 같아야 한다. True와 False는 첫 글자가 대문자다." },
      ],
    },
    {
      id: "python-collections", title: "list, tuple, set, dict", examTypes: ["written", "practical"], importance: "high", summary: "순서, 중복, 변경 가능 여부와 키-값 구조를 구분한다.",
      contents: [
        { type: "table", headers: ["자료구조", "순서", "중복", "가변"], rows: [["list", "있음", "허용", "예"], ["tuple", "있음", "허용", "아니요"], ["set", "보장 안 함", "불가", "예"], ["dict", "삽입 순서 유지", "키 불가", "예"]] },
        { type: "code", language: "python", value: "items = [1, 1, 2]\nunique = set(items)\npair = {'a': 90, 'b': 95}\nprint(len(items), len(unique), pair['a'])" },
        { type: "result", value: "3 2 90" },
      ],
    },
    {
      id: "python-operators", title: "산술·비교·논리 연산자", examTypes: ["written", "practical"], importance: "high", summary: "/, //, %, **와 비교·논리 연산의 결과를 구분한다.",
      contents: [
        { type: "table", headers: ["연산자", "의미", "예"], rows: [["/", "실수 나눗셈", "7 / 2 = 3.5"], ["//", "바닥 나눗셈", "7 // 2 = 3"], ["%", "나머지", "7 % 2 = 1"], ["**", "거듭제곱", "2 ** 3 = 8"], ["and, or, not", "논리 연산", "True and False = False"], ["==, !=, <, <=, >, >=", "비교", "3 < 4 = True"]] },
        { type: "code", language: "python", value: "print(7 / 2, 7 // 2, 7 % 2, 2 ** 3)\nprint(-7 // 2, -7 % 2)" },
        { type: "result", value: "3.5 3 1 8\n-4 1" },
        { type: "warning", title: "시험 함정", value: "//는 단순 소수부 제거가 아니라 음의 무한대 방향으로 내림한다. 그래서 -7 // 2는 -3이 아니라 -4다." },
      ],
    },
    {
      id: "python-control-range", title: "조건문, for·while과 range", examTypes: ["written", "practical"], importance: "high", summary: "range의 끝값 제외 규칙과 break·continue 흐름을 추적한다.",
      contents: [
        { type: "text", value: "range(start, stop, step)는 start부터 시작해 stop은 포함하지 않고 step만큼 이동한다. 인자를 하나만 쓰면 start는 0, step은 1이다." },
        { type: "code", language: "python", value: "total = 0\nfor n in range(1, 6, 2):\n    if n == 3:\n        continue\n    total += n\nprint(total)\n\ni = 0\nwhile i < 3:\n    i += 1\n    if i == 2:\n        break\nprint(i)" },
        { type: "result", value: "6\n2" },
        { type: "memory", value: "range의 stop은 제외, continue는 현재 반복 생략, break는 반복 종료다." },
      ],
    },
    {
      id: "python-slicing", title: "문자열·리스트 인덱싱과 슬라이싱", examTypes: ["written", "practical"], importance: "high", summary: "[start:stop:step]의 경계와 음수 인덱스를 계산한다.",
      contents: [
        { type: "code", language: "python", value: "text = 'Python'\nnums = [0, 1, 2, 3, 4, 5]\nprint(text[0], text[-1], text[1:5:2])\nprint(nums[::-1], nums[-4:-1])" },
        { type: "result", value: "P n yh\n[5, 4, 3, 2, 1, 0] [2, 3, 4]" },
        { type: "text", value: "음수 인덱스 -1은 마지막 원소다. 슬라이스는 start를 포함하고 stop을 제외한다. step이 -1인 [::-1]은 역순 복사본을 만든다." },
        { type: "warning", title: "시험 함정", value: "단일 인덱스가 범위를 벗어나면 IndexError지만, 슬라이스 경계가 범위를 넘어가면 가능한 범위로 잘린다." },
      ],
    },
    {
      id: "python-list-methods", title: "리스트 메서드", examTypes: ["written", "practical"], importance: "high", summary: "추가·삭제 메서드가 받는 값과 반환값을 구분한다.",
      contents: [
        { type: "table", headers: ["메서드", "기능", "차이"], rows: [["append(x)", "x 하나를 끝에 추가", "리스트 x도 한 원소"], ["extend(iterable)", "각 원소를 이어 붙임", "여러 원소 추가"], ["remove(x)", "첫 번째 값 x 삭제", "값 기준, 반환 None"], ["pop(i)", "인덱스 i 원소 삭제·반환", "기본은 마지막 원소"], ["insert(i, x)", "위치 i에 삽입", "기존 원소 뒤로 이동"], ["sort()", "제자리 정렬", "반환 None"]] },
        { type: "code", language: "python", value: "a = [1]\na.append([2, 3])\nb = [1]\nb.extend([2, 3])\nremoved = b.pop()\nprint(a, b, removed)" },
        { type: "result", value: "[1, [2, 3]] [1, 2] 3" },
      ],
    },
    {
      id: "python-copy", title: "참조와 복사, 얕은 복사와 깊은 복사", examTypes: ["written", "practical"], importance: "high", summary: "같은 객체를 공유하는지 중첩 객체까지 새로 만드는지 확인한다.",
      contents: [
        { type: "code", language: "python", value: "import copy\na = [[1], [2]]\nb = a\nc = a.copy()       # 얕은 복사\nd = copy.deepcopy(a) # 깊은 복사\na[0].append(9)\nprint(b, c, d)" },
        { type: "result", value: "[[1, 9], [2]] [[1, 9], [2]] [[1], [2]]" },
        { type: "text", value: "b = a는 복사가 아니라 같은 리스트를 가리키는 참조 대입이다. 얕은 복사는 바깥 컨테이너만 새로 만들고 중첩 객체는 공유한다. 깊은 복사는 중첩 객체까지 재귀적으로 복사한다." },
        { type: "memory", value: "id가 같으면 같은 객체, 얕은 복사는 속, 깊은 복사는 중첩까지 확인한다." },
      ],
    },
    {
      id: "python-mutability", title: "가변·불변 객체와 기본 매개변수", examTypes: ["written", "practical"], importance: "high", summary: "객체 변경과 새 객체 대입, 기본값 생성 시점을 구분한다.",
      contents: [
        { type: "table", headers: ["구분", "대표 자료형"], rows: [["가변", "list, dict, set"], ["불변", "int, float, bool, str, tuple"]] },
        { type: "code", language: "python", value: "def add(value, bucket=[]):\n    bucket.append(value)\n    return bucket\n\nprint(add(1))\nprint(add(2))" },
        { type: "result", value: "[1]\n[1, 2]" },
        { type: "warning", title: "시험 함정", value: "기본 매개변수는 함수 정의 시 한 번 만들어진다. 가변 기본값 대신 None을 사용하고 함수 안에서 새 리스트를 만드는 방식이 안전하다." },
      ],
    },
    {
      id: "python-string-dict-set", title: "문자열 메서드, 딕셔너리와 집합 연산", examTypes: ["written", "practical"], importance: "high", summary: "불변 문자열의 결과와 키-값·집합 연산을 익힌다.",
      contents: [
        { type: "table", headers: ["대상", "주요 기능"], rows: [["str", "upper, lower, strip, split, join, replace, find"], ["dict", "keys, values, items, get, update, pop"], ["set", "합집합 |, 교집합 &, 차집합 -, 대칭차집합 ^"]] },
        { type: "code", language: "python", value: "text = ' a,b '.strip().replace(',', '-')\nscores = {'a': 90}\nleft, right = {1, 2}, {2, 3}\nprint(text, scores.get('b', 0))\nprint(left | right, left & right)" },
        { type: "result", value: "a-b 0\n{1, 2, 3} {2}" },
        { type: "warning", title: "시험 함정", value: "문자열 메서드는 새 문자열을 반환한다. dict[key]는 키가 없으면 KeyError, get은 기본값을 돌려줄 수 있다. set 출력 순서는 의존하지 않는다." },
      ],
    },
    {
      id: "python-functions", title: "함수와 매개변수", examTypes: ["written", "practical"], importance: "medium", summary: "위치·키워드 인자와 반환값을 구분한다.",
      contents: [
        { type: "code", language: "python", value: "def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3), power(exponent=3, base=2))" },
        { type: "result", value: "9 8" },
        { type: "text", value: "return을 만나면 함수 실행이 끝난다. 명시적 return이 없으면 None을 반환한다. *args는 위치 인자를 튜플로, **kwargs는 키워드 인자를 딕셔너리로 모은다." },
      ],
    },
    {
      id: "python-classes", title: "클래스, 생성자, 상속과 오버라이딩", examTypes: ["written", "practical"], importance: "high", summary: "self로 현재 객체를 받고 하위 클래스에서 메서드를 재정의한다.",
      contents: [
        { type: "code", language: "python", value: "class Parent:\n    def value(self):\n        return 1\n\nclass Child(Parent):\n    def __init__(self, bonus):\n        self.bonus = bonus\n    def value(self):\n        return super().value() + self.bonus\n\nprint(Child(2).value())" },
        { type: "result", value: "3" },
        { type: "text", value: "__init__은 객체 생성 뒤 초기화할 때 호출된다. 인스턴스 메서드의 첫 매개변수 self는 현재 객체이며, super()로 상위 클래스 구현을 호출할 수 있다." },
      ],
    },
    {
      id: "python-output-traps", title: "실행 결과 문제의 핵심 함정", examTypes: ["practical"], importance: "high", summary: "경계, 공유 객체, 제자리 변경 여부를 먼저 확인한다.",
      contents: [
        { type: "table", headers: ["함정", "확인할 것"], rows: [["range·슬라이스", "stop 제외와 step 부호"], ["음수 //", "내림 방향"], ["리스트 대입", "같은 객체 참조 여부"], ["얕은 복사", "중첩 객체 공유 여부"], ["가변 기본값", "호출 사이 객체 재사용"], ["제자리 메서드", "sort·append 등의 반환값은 None"], ["set", "출력 순서를 가정하지 않음"]] },
        { type: "memory", value: "변수 옆에 값뿐 아니라 객체 식별 관계를 그리면 참조 문제를 정확히 풀 수 있다." },
      ],
    },
  ],
  mustMemorize: ["range와 슬라이스의 stop은 포함하지 않는다.", "append는 하나, extend는 iterable의 각 원소를 추가한다.", "대입은 같은 객체 참조, 얕은 복사는 중첩 객체를 공유한다.", "가변 기본 매개변수는 호출 사이에 재사용된다.", "문자열과 튜플은 불변 객체다."],
  commonMistakes: ["음수 //를 0 방향으로 버림하기", "슬라이스 stop 위치를 포함하기", "list 대입을 복사로 생각하기", "sort() 반환값을 정렬된 리스트로 생각하기", "set의 출력 순서를 고정해서 추적하기"],
};

const sql: LanguageStudyData = {
  id: "sql", name: "SQL", description: "작성 순서와 논리적 실행 순서를 구분해 결과 집합을 예측하는 핵심 과목",
  coreTopics: ["SELECT 실행 순서", "JOIN", "GROUP BY", "서브쿼리", "제약조건"],
  writtenImportance: "high", practicalImportance: "high",
  topics: [
    {
      id: "sql-categories", title: "DDL, DML, DCL, TCL", examTypes: ["written", "practical"], importance: "high", summary: "정의·조작·권한·트랜잭션 명령을 분류한다.",
      contents: [
        { type: "table", headers: ["분류", "목적", "명령"], rows: [["DDL", "구조 정의", "CREATE, ALTER, DROP, TRUNCATE"], ["DML", "데이터 조회·변경", "SELECT, INSERT, UPDATE, DELETE"], ["DCL", "권한 제어", "GRANT, REVOKE"], ["TCL", "트랜잭션 제어", "COMMIT, ROLLBACK, SAVEPOINT"]] },
        { type: "memory", value: "정의 DDL, 조작 DML, 권한 DCL, 트랜잭션 TCL로 묶는다." },
      ],
    },
    {
      id: "sql-ddl", title: "CREATE, ALTER, DROP, TRUNCATE", examTypes: ["written", "practical"], importance: "high", summary: "테이블 구조 생성·변경·삭제 명령을 익힌다.",
      contents: [
        { type: "code", language: "sql", value: "CREATE TABLE Student (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(30) NOT NULL\n);\nALTER TABLE Student ADD score INTEGER DEFAULT 0;\nTRUNCATE TABLE Student;\nDROP TABLE Student;" },
        { type: "text", value: "CREATE는 객체를 만들고 ALTER는 구조를 바꾼다. TRUNCATE는 테이블 구조를 남기고 모든 행을 빠르게 제거하며, DROP은 데이터와 테이블 정의 자체를 제거한다." },
      ],
    },
    {
      id: "sql-dml-tcl", title: "INSERT, UPDATE, DELETE와 트랜잭션", examTypes: ["written", "practical"], importance: "high", summary: "행 변경 범위와 COMMIT·ROLLBACK·SAVEPOINT를 확인한다.",
      contents: [
        { type: "code", language: "sql", value: "INSERT INTO Student (id, name, score) VALUES (1, 'Kim', 80);\nUPDATE Student SET score = score + 5 WHERE id = 1;\nSAVEPOINT before_delete;\nDELETE FROM Student WHERE id = 1;\nROLLBACK TO before_delete;\nCOMMIT;" },
        { type: "warning", title: "시험 함정", value: "UPDATE와 DELETE에서 WHERE를 생략하면 모든 행이 대상이다. COMMIT 후에는 일반적으로 이전 상태로 ROLLBACK할 수 없다." },
      ],
    },
    {
      id: "sql-dcl", title: "GRANT와 REVOKE", examTypes: ["written", "practical"], importance: "medium", summary: "객체 권한을 부여하고 회수한다.",
      contents: [
        { type: "code", language: "sql", value: "GRANT SELECT, INSERT ON Student TO user1;\nREVOKE INSERT ON Student FROM user1;" },
        { type: "text", value: "GRANT는 사용자나 역할에 권한을 부여하고 REVOKE는 부여된 권한을 회수한다. 세부 문법은 DBMS에 따라 일부 다를 수 있다." },
      ],
    },
    {
      id: "sql-select-order", title: "SELECT 작성 순서와 논리적 실행 순서", examTypes: ["written", "practical"], importance: "high", summary: "문장을 쓰는 순서와 DB가 논리적으로 처리하는 순서는 다르다.",
      contents: [
        { type: "table", headers: ["구분", "순서"], rows: [["작성 순서", "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY"], ["논리적 실행 순서", "FROM·JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT" ]] },
        { type: "code", language: "sql", value: "SELECT department, COUNT(*) AS employee_count\nFROM Employee\nWHERE active = 1\nGROUP BY department\nHAVING COUNT(*) >= 2\nORDER BY employee_count DESC;" },
        { type: "warning", title: "시험 함정", value: "WHERE는 SELECT보다 먼저 실행되므로 같은 단계의 SELECT 별칭을 WHERE에서 일반적으로 사용할 수 없다. ORDER BY에서는 별칭을 사용할 수 있다." },
        { type: "memory", value: "실행은 FROM에서 모으고 → WHERE로 거르고 → GROUP으로 묶고 → HAVING으로 그룹을 거르고 → SELECT로 고른 뒤 → ORDER로 정렬한다." },
      ],
    },
    {
      id: "sql-where", title: "WHERE와 조건 연산자", examTypes: ["written", "practical"], importance: "high", summary: "비교, 범위, 목록, 패턴, NULL 조건을 정확히 작성한다.",
      contents: [
        { type: "table", headers: ["조건", "예", "의미"], rows: [["비교", "score >= 80", "크기·동등 비교"], ["BETWEEN", "score BETWEEN 80 AND 90", "양쪽 경계 포함"], ["IN", "grade IN ('A', 'B')", "목록 중 하나"], ["LIKE", "name LIKE 'K%'", "%는 0자 이상, _는 1자"], ["IS NULL", "manager_id IS NULL", "NULL 검사"]] },
        { type: "warning", title: "시험 함정", value: "NULL은 = NULL로 비교하지 않고 IS NULL 또는 IS NOT NULL을 사용한다. NOT이 섞이면 괄호로 의도를 분명히 한다." },
      ],
    },
    {
      id: "sql-aggregate-group", title: "집계 함수, GROUP BY와 HAVING", examTypes: ["written", "practical"], importance: "high", summary: "행 집계와 그룹 조건을 구분하고 NULL 처리 차이를 이해한다.",
      contents: [
        { type: "table", headers: ["함수", "핵심"], rows: [["COUNT(*)", "NULL 여부와 관계없이 행 수"], ["COUNT(column)", "해당 열이 NULL이 아닌 행 수"], ["SUM / AVG", "NULL을 제외한 합계·평균"], ["MIN / MAX", "최솟값·최댓값"]] },
        { type: "code", language: "sql", value: "SELECT department, COUNT(*) AS total, COUNT(bonus) AS bonus_count\nFROM Employee\nGROUP BY department\nHAVING AVG(salary) >= 3000;" },
        { type: "warning", title: "시험 함정", value: "WHERE는 그룹화 전 행 조건, HAVING은 그룹화 후 그룹 조건이다. GROUP BY 쿼리의 SELECT에는 보통 그룹 열이나 집계식만 둔다." },
      ],
    },
    {
      id: "sql-order-distinct", title: "ORDER BY와 DISTINCT", examTypes: ["written", "practical"], importance: "medium", summary: "중복 제거 시점과 다중 정렬 우선순위를 이해한다.",
      contents: [
        { type: "code", language: "sql", value: "SELECT DISTINCT department, job\nFROM Employee\nORDER BY department ASC, job DESC;" },
        { type: "text", value: "DISTINCT는 SELECT 결과 열의 조합이 같은 행을 하나로 만든다. ORDER BY는 앞에 적은 열을 먼저 정렬하고, 방향을 생략하면 기본은 ASC다." },
      ],
    },
    {
      id: "sql-joins", title: "INNER·OUTER·SELF JOIN", examTypes: ["written", "practical"], importance: "high", summary: "일치 행과 보존할 행을 기준으로 JOIN 결과를 판단한다.",
      contents: [
        { type: "table", headers: ["JOIN", "결과"], rows: [["INNER JOIN", "양쪽 조건이 일치하는 행"], ["LEFT OUTER JOIN", "왼쪽 전체 + 오른쪽 일치, 불일치는 NULL"], ["RIGHT OUTER JOIN", "오른쪽 전체 + 왼쪽 일치"], ["FULL OUTER JOIN", "양쪽 전체, 불일치 부분은 NULL"], ["SELF JOIN", "같은 테이블을 별칭으로 두 번 연결"]] },
        { type: "code", language: "sql", value: "SELECT e.name, m.name AS manager_name\nFROM Employee e\nLEFT JOIN Employee m ON e.manager_id = m.id;" },
        { type: "warning", title: "시험 함정", value: "LEFT JOIN 뒤 오른쪽 테이블 조건을 WHERE에 두면 NULL 보존 행이 사라져 INNER JOIN처럼 될 수 있다. 보존하려는 조건은 ON 위치를 검토한다." },
      ],
    },
    {
      id: "sql-subqueries", title: "서브쿼리와 IN, EXISTS, ANY, ALL", examTypes: ["written", "practical"], importance: "high", summary: "단일·다중 행 결과와 존재 여부 비교를 구분한다.",
      contents: [
        { type: "table", headers: ["연산", "의미"], rows: [["IN", "목록·서브쿼리 결과 중 같은 값 존재"], ["EXISTS", "서브쿼리가 한 행이라도 반환하면 참"], ["> ANY", "결과 중 하나보다 크면 참"], ["> ALL", "결과의 모든 값보다 커야 참"]] },
        { type: "code", language: "sql", value: "SELECT name\nFROM Employee e\nWHERE EXISTS (\n  SELECT 1 FROM Department d\n  WHERE d.id = e.department_id AND d.active = 1\n);" },
        { type: "warning", title: "시험 함정", value: "단일 행 비교 연산자 =에 여러 행 서브쿼리를 연결하면 오류가 난다. NOT IN 서브쿼리 결과에 NULL이 있으면 UNKNOWN 때문에 예상과 다를 수 있어 NOT EXISTS를 검토한다." },
      ],
    },
    {
      id: "sql-delete-compare", title: "DELETE, TRUNCATE, DROP 비교", examTypes: ["written", "practical"], importance: "high", summary: "행 삭제, 전체 행 제거, 객체 삭제의 차이를 구분한다.",
      contents: [
        { type: "table", headers: ["명령", "분류", "WHERE", "테이블 구조", "일반적 특징"], rows: [["DELETE", "DML", "가능", "유지", "행 단위 삭제, 트랜잭션 대상"], ["TRUNCATE", "DDL", "불가", "유지", "전체 행 빠른 제거"], ["DROP", "DDL", "불가", "삭제", "객체 자체 제거"]] },
        { type: "warning", title: "주의", value: "자동 커밋과 롤백 가능 여부는 DBMS 설정과 제품에 따라 다를 수 있으므로 시험 문맥의 전제를 확인한다." },
      ],
    },
    {
      id: "sql-constraints", title: "제약조건과 참조 무결성", examTypes: ["written", "practical"], importance: "high", summary: "키·NULL·값 조건과 참조 대상 변경 시 동작을 정한다.",
      contents: [
        { type: "table", headers: ["제약조건", "의미"], rows: [["PRIMARY KEY", "행 식별, UNIQUE + NOT NULL"], ["FOREIGN KEY", "다른 테이블의 후보키를 참조"], ["UNIQUE", "열 값의 중복 제한"], ["NOT NULL", "NULL 금지"], ["CHECK", "값이 조건을 만족해야 함"], ["DEFAULT", "값 생략 시 기본값"]] },
        { type: "table", headers: ["참조 옵션", "부모 행 변경·삭제 시"], rows: [["CASCADE", "자식 행도 함께 변경·삭제"], ["SET NULL", "외래키를 NULL로 변경"], ["SET DEFAULT", "외래키를 기본값으로 변경"], ["RESTRICT", "참조 중이면 작업 거부"]] },
        { type: "warning", title: "시험 함정", value: "SET NULL은 외래키 열이 NULL을 허용해야 하고 SET DEFAULT는 유효한 기본값이 있어야 한다. UNIQUE의 NULL 처리 방식은 DBMS별 차이가 있다." },
      ],
    },
    {
      id: "sql-view-index", title: "VIEW와 INDEX", examTypes: ["written", "practical"], importance: "medium", summary: "논리적 가상 테이블과 검색 보조 구조의 장단점을 이해한다.",
      contents: [
        { type: "table", headers: ["객체", "목적", "주의"], rows: [["VIEW", "쿼리를 가상 테이블처럼 제공, 보안·단순화", "복잡한 뷰는 갱신 제한 가능"], ["INDEX", "검색·정렬 속도 향상", "저장 공간과 변경 비용 증가"]] },
        { type: "code", language: "sql", value: "CREATE VIEW ActiveEmployee AS\nSELECT id, name FROM Employee WHERE active = 1;\n\nCREATE INDEX idx_employee_department\nON Employee(department_id);" },
      ],
    },
    {
      id: "sql-output-traps", title: "SQL 실행 결과 문제의 핵심 함정", examTypes: ["practical"], importance: "high", summary: "NULL, 중복, JOIN 행 수와 실행 순서부터 확인한다.",
      contents: [
        { type: "table", headers: ["함정", "확인할 것"], rows: [["NULL", "=가 아닌 IS NULL, 3값 논리"], ["COUNT", "*와 열의 NULL 포함 차이"], ["JOIN", "1:N 연결로 늘어나는 행 수"], ["GROUP BY", "WHERE와 HAVING 시점"], ["DISTINCT", "선택한 전체 열 조합의 중복"], ["서브쿼리", "단일·다중 행과 NULL"], ["ORDER BY", "명시하지 않으면 순서 보장 없음"]] },
        { type: "memory", value: "FROM 결과표를 먼저 만들고 논리적 실행 순서대로 행 수와 NULL을 표시한다." },
      ],
    },
  ],
  mustMemorize: ["SELECT 논리 실행은 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY 순이다.", "COUNT(*)는 행, COUNT(열)은 NULL이 아닌 값을 센다.", "WHERE는 행 조건, HAVING은 그룹 조건이다.", "LEFT JOIN은 왼쪽 행을 보존한다.", "NULL 비교는 IS NULL을 사용한다."],
  commonMistakes: ["SELECT 작성 순서와 실행 순서 혼동하기", "COUNT(열)이 NULL도 센다고 생각하기", "LEFT JOIN 오른쪽 조건을 WHERE에 두어 보존 행 없애기", "NULL을 = NULL로 비교하기", "ORDER BY 없이 결과 순서를 가정하기"],
};

export const PROGRAMMING_STUDY_DATA: Record<LanguageId, LanguageStudyData> = {
  c, java, python, sql,
};

export function isLanguageId(value: string): value is LanguageId {
  return LANGUAGE_ORDER.includes(value as LanguageId);
}

export function createEmptyProgress(): ProgrammingStudyProgress {
  return { completed: { c: [], java: [], python: [], sql: [] }, recentLanguage: null };
}

export function getLanguageProgress(language: LanguageStudyData, completedIds: string[]): number {
  if (language.topics.length === 0) return 0;
  const valid = new Set(language.topics.map((topic) => topic.id));
  const completedCount = new Set(completedIds.filter((id) => valid.has(id))).size;
  return Math.round((completedCount / language.topics.length) * 100);
}

export function getOverallProgress(progress: ProgrammingStudyProgress): number {
  const topics = LANGUAGE_ORDER.flatMap((id) => PROGRAMMING_STUDY_DATA[id].topics);
  if (topics.length === 0) return 0;
  const completedCount = LANGUAGE_ORDER.reduce((total, id) => {
    const valid = new Set(PROGRAMMING_STUDY_DATA[id].topics.map((topic) => topic.id));
    return total + new Set(progress.completed[id].filter((topicId) => valid.has(topicId))).size;
  }, 0);
  return Math.round((completedCount / topics.length) * 100);
}
