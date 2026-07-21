export type ChoiceKey2025 = "A" | "B" | "C" | "D";

export type ExamCorrection2025 = {
  /** 화면에 표시할 교정 본문. originalQuestionText는 변경하지 않는다. */
  questionText?: string;
  /** 화면에 표시할 normalized 선택지만 덮어쓴다. */
  choices?: Partial<Record<ChoiceKey2025, string>>;
  correctAnswer?: ChoiceKey2025;
  originalAnswerText?: string;
  isCode?: boolean;
  isSql?: boolean;
  hasImageReference?: boolean;
  needsReview?: boolean;
  reviewReasons?: string[];
  /** 잘못 연결된 전체 페이지 자산을 비운 뒤 crops2025 결과를 연결한다. */
  removeAssets?: boolean;
};

export type ExamCrop2025 = {
  id: string;
  year: 2025;
  round: 1 | 2 | 3;
  questionNo: number;
  /** 1부터 시작하는 PDF 페이지 번호 */
  page: number;
  /** PDF를 1.5배로 렌더한 893×1263 PNG 기준 픽셀 좌표 */
  x: number;
  y: number;
  width: number;
  height: number;
  filename: string;
  altText: string;
};

/**
 * 2025년 1~3회 원본 PDF 300문항을 대조해 확정한 화면 표시용 교정값이다.
 * originalQuestionText와 choices.*.original은 이 모듈에서 절대 변경하지 않는다.
 */
export const corrections2025 = {
  // 2025년 1회
  "2025-1-1": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2025-1-3": {
    choices: {
      C: "익스트림 프로그래밍을 구동시키는 원리는 상식적인 원리와 경험을 최대한 끌어올리는 것이다.",
      D: "구체적인 실천 방법을 정의하고 있으며, 개발 문서보다는 소스 코드에 중점을 둔다.",
    },
    isCode: false,
  },
  "2025-1-4": {
    questionText: "럼바우(Rumbaugh) 분석 기법에서 정보 모델링이라고도 하며, 시스템에서 요구되는 객체를 찾아내어 속성과 연산을 식별하고 객체들 간의 관계를 규정하여 다이어그램으로 표시하는 모델링은?",
  },
  "2025-1-5": {
    questionText: "설계 기법 중 하향식 설계 방법과 상향식 설계 방법에 대한 비교 설명으로 가장 옳지 않은 것은?",
    choices: {
      C: "상향식 설계는 최하위 수준에서 각각의 모듈들을 설계하고 이러한 모듈이 완성되면 이들을 결합하여 검사한다.",
    },
    correctAnswer: "B",
    originalAnswerText: "④",
    needsReview: true,
    reviewReasons: [
      "원본 정답표는 ④이나, 하향식 설계에서는 하위 데이터 구조의 세부 사항이 초기 단계부터 필요하지 않으므로 정답을 ②로 교정",
    ],
  },
  "2025-1-6": {
    choices: {
      D: "구체적인 명세를 위해 자료 사전(DD: Data Dictionary)이 사용될 수 있다.",
    },
  },
  "2025-1-7": {
    choices: { D: "모듈의 크기를 가능한 작게 구성하여 병행성 수준을 높여야 한다." },
  },
  "2025-1-8": {
    choices: {
      A: "기능적 모델은 사용자 측면에서 본 시스템 기능이며, UML에서는 Use Case Diagram을 사용한다.",
      B: "정적 모델은 객체, 속성, 연관 관계, 오퍼레이션 등 시스템의 구조를 나타내며, UML에서는 Class Diagram을 사용한다.",
      D: "State Diagram은 객체들 사이의 메시지 교환을 나타내며, Sequence Diagram은 하나의 객체가 가진 상태와 그 상태의 변화에 의한 동작 순서를 나타낸다.",
    },
    isCode: false,
  },
  "2025-1-9": { isCode: false },
  "2025-1-11": {
    choices: {
      B: "서브시스템이 입력 데이터를 받아 처리하고 결과를 다음 서브시스템으로 넘겨주는 과정을 반복한다.",
      D: "3개의 서브시스템(모델, 뷰, 제어)으로 구성되어 있다.",
    },
  },
  "2025-1-12": {
    questionText: "데이터 흐름도(DFD)의 구성 요소에 포함되지 않는 것은?",
  },
  "2025-1-15": {
    choices: { D: "객체지향 설계 및 구현의 생산성을 높이는 데 적합하다." },
  },
  "2025-1-17": { isCode: false },
  "2025-1-18": {
    choices: {
      B: "구조적 방법론에서는 DFD(Data Flow Diagram), DD(Data Dictionary) 등을 사용하여 요구사항의 결과를 표현한다.",
      D: "소프트웨어 모델을 사용할 경우 개발될 소프트웨어에 대한 이해도 및 이해관계자 간의 의사소통 향상에 도움이 된다.",
    },
  },
  "2025-1-19": { isCode: false },
  "2025-1-20": {
    questionText: "객체지향 개념 중 하나 이상의 유사한 객체들을 묶어 공통된 특성을 표현한 데이터 추상화를 의미하는 것은?",
  },
  "2025-1-21": {
    choices: { C: "Valgrind" },
    isCode: false,
  },
  "2025-1-22": {
    questionText: "White Box Testing에 대한 설명으로 옳지 않은 것은?",
    choices: {
      A: "Base Path Testing, Boundary Value Analysis가 대표적인 기법이다.",
      B: "Source Code의 모든 문장을 한 번 이상 수행함으로써 진행된다.",
    },
  },
  "2025-1-24": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2025-1-25": {
    questionText: "디지털 저작권 관리(DRM) 기술과 거리가 먼 것은?",
    choices: { D: "라이선스 발급 및 관리" },
  },
  "2025-1-26": {
    questionText: "다음 자료에 대하여 ‘Selection Sort’를 사용하여 오름차순으로 정렬한 경우 PASS 3의 결과는?\n\n초기 상태: 8, 3, 4, 9, 7",
  },
  "2025-1-28": {
    choices: {
      A: "Gradle은 실행할 처리 명령들을 모아 태스크로 만든 후 태스크 단위로 실행한다.",
      D: "Jenkins는 Groovy를 기반으로 한 오픈 소스로 안드로이드 앱 개발 환경에서 사용된다.",
    },
  },
  "2025-1-29": { isCode: false },
  "2025-1-30": {
    questionText: "EAI(Enterprise Application Integration) 구축 유형 중 Hybrid에 대한 설명으로 틀린 것은?",
    choices: {
      A: "Hub & Spoke와 Message Bus의 혼합 방식이다.",
      D: "중간에 미들웨어를 두지 않고 각 애플리케이션을 point-to-point로 연결한다.",
    },
  },
  "2025-1-31": {
    choices: { D: "스택은 서브루틴 호출, 인터럽트 처리, 수식 계산 및 수식 표기법에 응용된다." },
  },
  "2025-1-32": {
    questionText: "그래프의 특수한 형태로 노드(Node)와 선분(Branch)으로 되어 있고, 정점 사이에 사이클(Cycle)이 형성되어 있지 않으며, 자료 사이의 관계성이 계층 형식으로 나타나는 비선형 구조는?",
  },
  "2025-1-35": {
    choices: {
      B: "신규 및 변경 개발 소스를 식별하고, 이를 모듈화하여 상용 제품으로 패키징한다.",
      C: "고객의 편의성을 위해 매뉴얼 및 버전 관리를 지속적으로 한다.",
      D: "범용 환경에서 사용이 가능하도록 일반적인 배포 형태로 패키징이 진행된다.",
    },
  },
  "2025-1-37": {
    questionText: "개별 모듈을 시험하는 것으로, 모듈이 정확하게 구현되었는지, 예정한 기능이 제대로 수행되는지를 점검하는 것이 주목적인 테스트는?",
  },
  "2025-1-38": {
    questionText: "소프트웨어 테스트에서 검증(Verification)과 확인(Validation)에 대한 설명으로 틀린 것은?",
    choices: {
      C: "검증은 작업 제품이 요구 명세의 기능·비기능 요구사항을 얼마나 잘 준수하는지 측정하는 작업이다.",
      D: "검증은 작업 제품이 사용자의 요구에 적합한지 측정하며, 확인은 작업 제품이 개발자의 기대를 충족시키는지를 측정한다.",
    },
  },
  "2025-1-39": {
    questionText: "테스트를 목적에 따라 분류했을 때, 강도(Stress) 테스트에 대한 설명으로 옳은 것은?",
    choices: {
      C: "사용자의 이벤트에 시스템이 응답하는 시간, 특정 시간 내에 처리하는 업무량, 사용자 요구에 시스템이 반응하는 속도 등을 테스트한다.",
    },
  },
  "2025-1-40": { isCode: false },
  "2025-1-41": {
    questionText: "데이터 제어 언어(DCL)의 기능으로 옳지 않은 것은?",
    choices: { D: "병행 수행 제어" },
    isSql: false,
  },
  "2025-1-42": {
    questionText: "병행제어의 로킹(Locking) 단위에 대한 설명으로 옳지 않은 것은?",
    isCode: false,
  },
  "2025-1-43": {
    choices: {
      A: "A → B이고 B → C일 때, A → C를 만족하는 관계",
      B: "A → B이고 B → C일 때, C → A를 만족하는 관계",
      C: "A → B이고 B → C일 때, B → A를 만족하는 관계",
      D: "A → B이고 B → C일 때, C → B를 만족하는 관계",
    },
  },
  "2025-1-44": {
    questionText: "SQL의 분류 중 DDL에 해당하지 않는 것은?",
    isSql: false,
  },
  "2025-1-45": {
    questionText: "데이터베이스 로그(log)를 필요로 하는 회복 기법은?",
    choices: { C: "타임스탬프 기법" },
  },
  "2025-1-46": {
    questionText: "Commit과 Rollback 명령어에 의해 보장받는 트랜잭션의 특성은?",
  },
  "2025-1-47": {
    questionText: "한 릴레이션 스키마가 4개 속성, 2개 후보키 그리고 그 스키마의 대응 릴레이션 인스턴스가 7개 튜플을 갖는다면 그 릴레이션의 차수(Degree)는?",
  },
  "2025-1-48": {
    questionText: "사용자 X1에게 department 테이블에 대한 검색 연산을 회수하는 명령은?",
  },
  "2025-1-49": {
    questionText: "개체-관계 모델의 E-R 다이어그램에서 사용되는 기호와 그 의미의 연결이 틀린 것은?",
    choices: { B: "선 - 개체 타입과 속성을 연결" },
  },
  "2025-1-50": {
    questionText: "3NF에서 BCNF가 되기 위한 조건은?",
  },
  "2025-1-51": {
    questionText: "뷰(VIEW)에 대한 설명으로 옳지 않은 것은?",
    choices: { C: "뷰에 대한 삽입·갱신·삭제 연산 시 제약 사항이 따르지 않는다." },
  },
  "2025-1-52": {
    questionText: `다음 릴레이션의 카디널리티와 차수가 옳게 나타난 것은?

| 아이디 | 성명 | 나이 | 등급 | 적립금 | 가입 연도 |
|---|---|---:|---:|---:|---:|
| yuyu01 | 원유철 | 36 | 3 | 2000 | 2008 |
| sykim10 | 김성일 | 29 | 2 | 3300 | 2014 |
| kshan4 | 한경선 | 45 | 3 | 2800 | 2009 |
| namsu52 | 이남수 | 33 | 5 | 1000 | 2016 |`,
    hasImageReference: false,
    removeAssets: true,
  },
  "2025-1-53": {
    questionText: `다음 SQL문에서 ( ) 안에 들어갈 내용으로 옳은 것은?

UPDATE 인사급여
( ) 호봉 = 15
WHERE 성명 = '홍길동';`,
    isSql: true,
    removeAssets: true,
  },
  "2025-1-55": { isSql: false },
  "2025-1-56": {
    choices: { D: "질의에 대한 해를 구하기 위해 수행해야 할 연산의 순서를 명시한다." },
  },
  "2025-1-57": {
    questionText: "SQL문에서 HAVING을 사용할 수 있는 절은?",
    isSql: false,
  },
  "2025-1-58": {
    questionText: "데이터베이스의 무결성 규정(Integrity Rule)과 관련한 설명으로 틀린 것은?",
    choices: {
      A: "무결성 규정에는 데이터가 만족해야 될 제약 조건, 규정을 참조할 때 사용하는 식별자 등의 요소가 포함될 수 있다.",
      D: "릴레이션 무결성 규정(Relation Integrity Rules)은 릴레이션을 조작하는 과정에서의 의미적 관계(Semantic Relationship)를 명세한 것이다.",
    },
  },
  "2025-1-59": {
    choices: { C: "데이터베이스의 설계가 비교적 어렵고, 개발 비용과 처리 비용이 증가한다는 단점이 있다." },
  },
  "2025-1-60": { isSql: false },
  "2025-1-61": {
    questionText: "IP 주소 체계와 관련한 설명으로 틀린 것은?",
    choices: {
      B: "IPv6는 주소 자동 설정(Auto Configuration) 기능을 통해 손쉽게 이용자의 단말을 네트워크에 접속시킬 수 있다.",
      C: "IPv4는 호스트 주소를 자동으로 설정하며 유니캐스트(Unicast)를 지원한다.",
    },
  },
  "2025-1-63": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>

struct st {
    int a;
    int c[10];
};

int main(int argc, char* argv[]) {
    int i = 0;
    struct st ob1;
    struct st ob2;
    ob1.a = 0;
    ob2.a = 0;
    for (i = 0; i < 10; i++) {
        ob1.c[i] = i;
        ob2.c[i] = ob1.c[i] + i;
    }
    for (i = 0; i < 10; i = i + 2) {
        ob1.a = ob1.a + ob1.c[i];
        ob2.a = ob2.a + ob2.c[i];
    }
    printf("%d", ob1.a + ob2.a);
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-1-64": {
    questionText: "다음 중 C 언어에서 우선순위가 가장 높은 것은?",
  },
  "2025-1-65": {
    questionText: `다음 Python 코드에서 '53t44'를 입력했을 때 출력 결과는?

a, b = map(int, input().split('t'))
print(a, b)`,
    isCode: true,
    removeAssets: true,
  },
  "2025-1-66": {
    questionText: "흐름 제어(Flow Control)에 대한 설명으로 옳지 않은 것은?",
    choices: {
      A: "정지 대기는 수신 측의 확인 신호(ACK)를 받은 후에 다음 패킷을 전송하는 방식이다.",
      D: "이전에 송신한 패킷에 대한 부정 수신 응답(NAK)이 전달된 경우 윈도우 크기가 증가한다.",
    },
  },
  "2025-1-67": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때의 결과는?

#include <stdio.h>

int main(void) {
    int n = 4;
    int* pt = NULL;
    pt = &n;
    printf("%d", &n + *pt - *&pt + n);
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-1-70": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때의 결과는?

#include <stdio.h>

main() {
    char* s = "Sinagong";
    for (int i = 5; i > 0; i--)
        printf("%c", *(s + i));
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-1-71": {
    questionText: "OSI 7계층 모델에서 전송에 필요한 장치 간의 실제 접속과 절단 등 기계적, 전기적, 기능적, 절차적 특성을 정의한 계층은?",
  },
  "2025-1-72": {
    questionText: `다음 Java 코드를 실행한 결과는?

int x = 1, y = 6;
while (y--) {
    x++;
}
System.out.println("x=" x + "y=" y);`,
    choices: { A: "x=7 y=0", B: "x=6 y=-1", C: "x=7 y=-1", D: "Unresolved compilation problem 오류 발생" },
    isCode: true,
    removeAssets: true,
  },
  "2025-1-74": {
    questionText: "128.107.176.0/22인 네트워크에서 호스트에 의해 사용될 수 있는 서브넷 마스크는?",
  },
  "2025-1-75": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    char str1[20] = "KOREA";
    char str2[20] = "LOVE";
    char* p1 = NULL;
    char* p2 = NULL;
    p1 = str1;
    p2 = str2;
    str1[1] = p2[2];
    str2[3] = p1[4];
    strcat(str1, str2);
    printf("%c", *(p1 + 2));
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-1-76": {
    questionText: `다음과 같은 세그먼트 테이블을 가지는 시스템에서 논리 주소 (2, 176)에 대한 물리 주소는?

| 세그먼트 번호 | 시작 주소 | 길이(바이트) |
|---:|---:|---:|
| 0 | 670 | 248 |
| 1 | 1752 | 422 |
| 2 | 222 | 198 |
| 3 | 996 | 604 |`,
    hasImageReference: false,
    removeAssets: true,
  },
  "2025-1-79": {
    questionText: "파일 디스크립터(File Descriptor)에 대한 설명으로 틀린 것은?",
    choices: {
      B: "파일 제어 블록(File Control Block)이라고도 한다.",
      D: "주기억장치에 저장되어 있다가 파일이 개방(open)되면 보조기억장치로 이동된다.",
    },
  },
  "2025-1-80": {
    choices: { A: "문자열을 수치 데이터로 바꾸는 문자 변환 함수와 수치를 문자열로 바꿔주는 변환 함수 등이 있다." },
  },
  "2025-1-81": {
    questionText: "데이터의 송·수신 사실을 증명할 수 있도록 송·수신 증거를 제공해야 한다는 보안 요소는?",
  },
  "2025-1-82": {
    questionText: "악성코드의 유형 중 다른 컴퓨터의 취약점을 이용하여 스스로 전파하거나 메일로 전파되며 스스로를 증식하는 것은?",
    isCode: false,
  },
  "2025-1-83": {
    choices: {
      A: "소프트웨어의 규모, 인력 등의 요소를 기반으로 개발에 필요한 비용을 예측하는 것이다.",
      B: "소프트웨어 비용 산정 기법에는 상향식, 하향식, 혼합식 기법이 있다.",
      D: "소프트웨어 비용 결정 요소에는 프로젝트 요소, 자원 요소, 생산성 요소가 있다.",
    },
  },
  "2025-1-85": {
    questionText: "국내 IT 서비스 경쟁력 강화를 목표로 개발되었으며 인프라 제어 및 관리 환경, 실행 환경, 개발 환경, 서비스 환경, 운영 환경으로 구성되어 있는 개방형 클라우드 컴퓨팅 플랫폼은?",
  },
  "2025-1-87": {
    questionText: "최대 홉 수를 15로 제한한 라우팅 프로토콜은?",
  },
  "2025-1-91": {
    choices: { A: "프로젝트를 이루는 소작업별로 언제 시작되고 언제 끝나야 하는지를 한눈에 볼 수 있도록 도와준다." },
  },
  "2025-1-92": {
    questionText: `다음에서 설명하는 소프트웨어 정의 기술(SDx)은?

• 가상화를 적용하여 필요한 공간만큼 나누어 사용할 수 있도록 하며, 서버 가상화와 유사함
• 컴퓨팅 소프트웨어로 규정하는 데이터 스토리지 체계이며, 일정 조직 내 여러 스토리지를 하나처럼 관리하고 운용하는 컴퓨터 이용 환경
• 스토리지 자원을 효율적으로 나누어 쓰는 방법으로 이해할 수 있음`,
  },
  "2025-1-93": {
    hasImageReference: false,
    isSql: false,
    removeAssets: true,
  },
  "2025-1-94": {
    questionText: "나선형(Spiral) 모형의 주요 태스크에 해당되지 않는 것은?",
  },
  "2025-1-95": {
    questionText: "소프트웨어 재공학의 주요 활동 중 기존 소프트웨어를 다른 운영체제나 하드웨어 환경에서 사용할 수 있도록 변환하는 것은?",
  },
  "2025-1-96": {
    questionText: "강제 접근 통제(MAC)의 보안 모델 중 서로 이익 충돌 관계에 있는 객체 간의 정보 접근을 통제하는 모델은?",
    choices: {
      A: "벨-라파둘라 모델(Bell-LaPadula Model)",
      D: "클락-윌슨 무결성 모델(Clark-Wilson Integrity Model)",
    },
  },
  "2025-1-97": {
    choices: {
      A: "프로젝트 수행 시 예상되는 변화를 배제하고 신속히 진행하여야 한다.",
      B: "프로젝트에 최적화된 개발 방법론을 적용하기 위해 절차, 산출물 등을 적절히 변경하는 활동이다.",
      C: "관리 측면에서의 목적 중 하나는 최단기간에 안정적인 프로젝트 진행을 위한 사전 위험을 식별하고 제거하는 것이다.",
    },
  },
  "2025-1-98": {
    questionText: "Public 메소드로부터 Private 배열이 반환될 경우 발생하는 문제점으로 가장 옳은 것은?",
  },
  "2025-1-99": {
    questionText: "해시(Hash) 기법에 대한 설명으로 틀린 것은?",
    choices: { D: "해시 함수는 일방향 함수(One-way Function)이다." },
  },
  "2025-1-100": {
    choices: {
      A: "Ping of Death 공격은 정상 크기보다 큰 ICMP 패킷을 작은 조각(Fragment)으로 쪼개어 공격 대상이 조각화된 패킷을 처리하게 만드는 공격 방법이다.",
      C: "SYN Flooding은 존재하지 않는 클라이언트가 서버별로 한정된 접속 가능 공간에 접속한 것처럼 속여 다른 사용자가 서비스를 이용하지 못하게 하는 것이다.",
    },
    hasImageReference: false,
    removeAssets: true,
  },

  // 2025년 2회
  "2025-2-2": {
    choices: {
      A: "GUI(Graphical User Interface)",
      D: "CLI(Command Line Interface)",
    },
  },
  "2025-2-9": {
    questionText: "UI를 설계할 때 사용자 측면에서의 요구사항으로 사용자가 원하는 목표를 달성하기 위해 수행할 내용을 기술하는 것은?",
  },
  "2025-2-11": {
    choices: { A: "E-R 다이어그램을 사용하여 객체의 행위를 데이터 모델링하는 데 초점을 둔 방법이다." },
  },
  "2025-2-13": {
    choices: { C: "개발될 시스템에 대하여 여러 분야의 엔지니어들이 공통된 개념을 공유하는 데 도움을 준다." },
  },
  "2025-2-17": {
    questionText: "UML에서 활용되는 다이어그램 중 시스템의 동작을 표현하는 행위(Behavioral) 다이어그램에 해당하지 않는 것은?",
  },
  "2025-2-26": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2025-2-29": {
    choices: { D: "설치 매뉴얼에는 목차, 개요, 기본 사항 등이 기본적으로 포함되어야 한다." },
  },
  "2025-2-31": {
    questionText: "스택(Stack)에 대한 설명으로 틀린 것은?",
  },
  "2025-2-34": {
    questionText: "정렬된 N개의 데이터를 처리하는 데 O(N log₂ N)의 시간이 소요되는 정렬 알고리즘은?",
  },
  "2025-2-35": {
    choices: { A: "코드의 중복을 최소화한다." },
  },
  "2025-2-39": {
    choices: { A: "AJTML" },
    isCode: false,
    needsReview: true,
    reviewReasons: ["원본 PDF 선택지 ①이 실제로 'AJTML'로 인쇄되어 있어 원문 표기를 유지함"],
  },
  "2025-2-41": {
    questionText: "트랜잭션의 특성 중 다음 설명에 해당하는 것은?\n\n트랜잭션의 연산은 데이터베이스에 모두 반영되든지 아니면 전혀 반영되지 않아야 한다.",
  },
  "2025-2-43": {
    questionText: "데이터베이스 시스템에서 삽입, 갱신, 삭제 등의 이벤트가 발생할 때마다 관련 작업이 자동으로 수행되는 절차형 SQL은?",
    isSql: false,
  },
  "2025-2-44": {
    questionText: `STUDENT 테이블에 독일어과 학생 50명, 중국어과 학생 30명, 영어영문학과 학생 50명의 정보가 저장되어 있을 때, 다음 두 SQL문의 실행 결과 튜플 수는? (단, DEPT 컬럼은 학과명)

ⓐ SELECT DEPT FROM STUDENT;
ⓑ SELECT DISTINCT DEPT FROM STUDENT;`,
    isSql: true,
  },
  "2025-2-45": { isSql: false },
  "2025-2-52": {
    choices: { B: "삽입 이상이란 릴레이션에서 데이터를 삽입할 때 의도와는 상관없이 원하지 않는 값들도 함께 삽입되는 현상이다." },
  },
  "2025-2-53": {
    questionText: "개체-관계 모델(E-R)의 그래픽 표현으로 옳지 않은 것은?",
  },
  "2025-2-54": { isSql: false },
  "2025-2-55": {
    choices: { D: "로킹은 파일 단위로 이루어지며, 레코드와 필드는 로킹 단위가 될 수 없다." },
  },
  "2025-2-56": {
    questionText: `테이블 R과 S에 대해 다음 SQL문이 실행되었을 때, 실행 결과로 옳은 것은?

R

| A | B |
|---:|---|
| 1 | A |
| 3 | B |

S

| A | B |
|---:|---|
| 1 | A |
| 2 | B |

SELECT A FROM R
UNION ALL
SELECT A FROM S;`,
    choices: {
      A: "1",
      B: "3, 2",
      C: "1, 3",
      D: "1, 3, 1, 2",
    },
    isSql: true,
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2025-2-58": {
    choices: { D: "기본 사용 형식은 'DELETE FROM 테이블 [WHERE 조건];'이다." },
    isSql: false,
  },
  "2025-2-60": { isSql: false },
  "2025-2-61": {
    choices: { B: "Go-Back-N ARQ" },
  },
  "2025-2-63": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>

int main(int argc, char* argv[]) {
    int a = 5, b = 3, c = 12;
    int t1, t2, t3;
    t1 = a && b;
    t2 = a || b;
    t3 = !c;
    printf("%d", t1 + t2 + t3);
    return 0;
}`,
    choices: { A: "0", B: "2", C: "5", D: "14" },
    isCode: true,
    removeAssets: true,
  },
  "2025-2-65": {
    questionText: `다음 Python 프로그램이 실행되었을 때, 실행 결과는?

strA = 'Information Technology'
strL = list()
for i in range(0, len(strA), 2):
    strL.append(strA[i])
for j in range(len(strL) - 1, 0, -2):
    print(strL[j], end='')`,
    isCode: true,
    removeAssets: true,
  },
  "2025-2-66": {
    choices: {
      A: "반복, 스택, 부프로그램은 시간 지역성(Temporal Locality)과 관련이 있다.",
      B: "공간 지역성(Spatial Locality)은 프로세스가 어떤 페이지를 참조했다면 이후 가상 주소 공간상 그 페이지와 인접한 페이지들을 참조할 가능성이 높음을 의미한다.",
      C: "일반적으로 페이지 교환에 보내는 시간보다 프로세스 수행에 보내는 시간이 더 크면 스레싱(Thrashing)이 발생한다.",
    },
  },
  "2025-2-67": {
    questionText: `다음은 정수 배열 a에 0부터 9까지의 무작위 수를 저장하는 Java 코드이다. 괄호에 들어갈 알맞은 코드는 무엇인가?

import ( ).*;

public class Test {
    public static void main(String[] args) {
        Random rand = new Random();
        int a[] = new int[6];
        for (int i = 0; i < 6; i++)
            a[i] = rand.nextInt(10);
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-2-68": {
    choices: { D: "변수를 export시키면 전역(Global) 변수처럼 되어 끝까지 기억된다." },
  },
  "2025-2-69": {
    questionText: `다음 Java 프로그램이 실행되었을 때의 결과는?

public class Test {
    public static void main(String[] args) {
        int x = 7, y = 0;
        while (x-- > 0) {
            if (x % 3 == 0)
                continue;
            y++;
        }
        System.out.print(y);
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-2-71": { isCode: false },
  "2025-2-72": {
    questionText: "다음의 페이지 참조 열(Page Reference)에 대해 페이지 교체 기법으로 선입선출 알고리즘을 사용할 경우 페이지 부재(Page Fault) 횟수는? (단, 할당된 페이지 프레임 수는 3이고, 처음에는 모든 프레임이 비어 있다.)\n\n페이지 참조 열: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0",
  },
  "2025-2-74": {
    questionText: `다음 Python 코드 출력문의 결과는?

print(4, 1, 2, sep=',', end='')
print(3, 5, sep='/')`,
    choices: {
      A: "4,1,23/5",
      B: "4 1 23/5",
      C: "4,1,2\n3/5",
      D: "4 1 2\n3 5",
    },
    isCode: true,
    removeAssets: true,
  },
  "2025-2-76": {
    questionText: `다음은 Python으로 작성된 반복문이다. 실행 결과는?

while True:
    print('A')
    print('B')
    break
    print('C')
    print('D')`,
    choices: { D: "A, B까지만 출력된다." },
    correctAnswer: "D",
    originalAnswerText: "④",
    isCode: true,
    hasImageReference: false,
    needsReview: true,
    reviewReasons: ["원본 선택지 ④는 'A, B, D까지만 출력된다.'이나 break 이후 코드는 실행되지 않으므로 화면용 선택지를 'A, B까지만 출력된다.'로 교정"],
    removeAssets: true,
  },
  "2025-2-79": {
    choices: { A: "소프트웨어 구성에 필요한 기본 구조를 제공함으로써 재사용이 가능하게 해준다." },
  },
  "2025-2-80": {
    choices: { D: "단편화를 하면 전송 시간이 단축되고 효과적인 오류 제어가 가능하다." },
  },
  "2025-2-81": {
    questionText: "TCP/IP 기반 네트워크에서 동작하는 발행-구독 기반의 메시징 프로토콜로, 최근 IoT 환경에서 자주 사용되고 있는 프로토콜은?",
  },
  "2025-2-82": {
    questionText: "다음 설명에 해당하는 소프트웨어 개발 방법론은 무엇인가?\n\n• 기존의 시스템이나 소프트웨어를 구성하는 컴포넌트를 조합하여 하나의 새로운 애플리케이션을 만드는 방법론이다.\n• 컴포넌트의 재사용(Reusability)이 가능하여 시간과 노력을 절감할 수 있다.",
  },
  "2025-2-85": {
    questionText: "다음 내용이 설명하는 스토리지 시스템은?\n\n• 하드디스크와 같은 데이터 저장장치를 호스트 버스 어댑터에 직접 연결하는 방식\n• 저장장치와 호스트 기기 사이에 네트워크 디바이스가 있지 말아야 하고 직접 연결하는 방식으로 구성",
  },
  "2025-2-86": {
    questionText: "물리적인 사물과 컴퓨터에 동일하게 표현되는 가상의 모델로, 실제 물리적인 자산 대신 소프트웨어로 가상화함으로써 실제 자산의 특성에 대한 정확한 정보를 얻을 수 있고, 자산 최적화, 돌발 사고 최소화, 생산성 증가 등 설계부터 제조, 서비스에 이르는 모든 과정의 효율성을 향상시킬 수 있는 모델은?",
  },
  "2025-2-88": {
    questionText: "기존 무선 LAN의 한계 극복을 위해 등장하였으며, 대규모 디바이스의 네트워크 생성에 최적화되어 차세대 이동통신, 홈 네트워킹, 공공 안전 등의 특수 목적에 사용되는 새로운 방식의 네트워크 기술을 의미하는 것은?",
  },
  "2025-2-90": {
    questionText: "시스템에 저장되는 패스워드들은 해시(Hash) 또는 암호화 알고리즘의 결과 값으로 저장된다. 이때 암호 공격을 막기 위해 똑같은 패스워드들이 서로 다른 암호 값으로 저장되도록 추가하는 값을 의미하는 것은?",
  },
  "2025-2-93": {
    questionText: "크래커가 침입하여 백도어를 만들어 놓거나 설정 파일을 변경했을 때 분석하는 도구는?",
  },
  "2025-2-94": {
    questionText: "다음 내용이 설명하는 것은?\n\n• 블록체인(Blockchain) 개발 환경을 클라우드로 서비스하는 개념\n• 블록체인 네트워크에 노드의 추가 및 제거가 용이\n• 블록체인의 기본 인프라를 추상화하여 블록체인 응용 프로그램을 만들 수 있는 클라우드 컴퓨팅 플랫폼",
  },
  "2025-2-95": {
    questionText: "다음 설명에 해당하는 비용 산정 기법은?\n\n• 조직 내에 있는 경험이 많은 두 명 이상의 전문가에게 비용 산정을 의뢰하는 기법이다.\n• 가장 편리하고 신속하게 비용을 산정할 수 있으며, 의뢰자로부터 믿음을 얻을 수 있다.\n• 개인적이고 주관적일 수 있다.",
  },
  "2025-2-98": {
    questionText: "시스템의 사용자가 로그인하여 명령을 내리는 과정에 대한 시스템의 동작 중 다음 설명에 해당하는 것은?\n\n• 자신의 신원(Identity)을 시스템에 증명하는 과정이다.\n• 아이디와 패스워드를 입력하는 과정이 가장 일반적인 예시라고 볼 수 있다.",
  },

  // 2025년 3회
  "2025-3-6": {
    hasImageReference: false,
    removeAssets: true,
  },
  "2025-3-11": {
    choices: {
      A: "GUI(Graphical User Interface)",
      D: "CLI(Command Line Interface)",
    },
  },
  "2025-3-15": {
    choices: { C: "실제 작동하는 소프트웨어보다는 이해하기 좋은 문서에 더 가치를 둔다." },
  },
  "2025-3-17": {
    choices: {
      A: "OMG에서 만든 통합 모델링 언어로서 객체지향적 분석·설계 방법론의 표준 지정을 목표로 한다.",
      D: "개발자와 고객 또는 개발자 상호 간의 의사소통을 원활하게 할 수 있다.",
    },
  },
  "2025-3-20": {
    questionText: "모듈화를 통해 분리된 시스템의 각 기능들로, 서브루틴, 서브시스템, 소프트웨어 내의 프로그램, 작업 단위 등과 같은 의미로 사용되는 것은?",
  },
  "2025-3-26": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2025-3-28": {
    questionText: "다음이 설명하는 테스트 용어는?\n\n• 테스트의 결과가 참인지 거짓인지를 판단하기 위해 사전에 정의된 참값을 입력하여 비교하는 기법 및 활동을 말한다.\n• 종류에는 참, 샘플링, 휴리스틱, 일관성 검사가 존재한다.",
  },
  "2025-3-29": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2025-3-35": {
    choices: { D: "클라이언트-서버 방식" },
  },
  "2025-3-43": {
    questionText: "데이터 무결성 제약 조건 중 개체 무결성 제약 조건에 대한 설명으로 맞는 것은?",
  },
  "2025-3-45": {
    questionText: `player 테이블에는 player_name, team_id, height 컬럼이 존재한다. 아래 SQL문에서 문법적 오류가 있는 부분은?

(1) SELECT player_name, height
(2) FROM player
(3) WHERE team_id = 'korea'
(4) AND height BETWEEN 170 OR 180;`,
    isSql: true,
  },
  "2025-3-46": { isSql: false },
  "2025-3-47": {
    choices: { C: "보이스/코드 정규형" },
  },
  "2025-3-49": {
    choices: { C: "질의에 대한 해를 구하기 위해 수행해야 할 연산의 순서를 명시한다." },
  },
  "2025-3-50": {
    questionText: "정규화된 엔티티, 속성, 관계를 시스템의 성능 향상과 개발·운영의 단순화를 위해 중복, 통합, 분리 등을 수행하는 데이터 모델링 기법은?",
  },
  "2025-3-52": {
    choices: { A: "시스템 카탈로그의 갱신은 무결성 유지를 위하여 SQL을 이용하여 사용자가 직접 갱신하여야 한다." },
    isSql: false,
  },
  "2025-3-53": {
    choices: { D: "속성의 수를 cardinality라고 한다." },
  },
  "2025-3-54": {
    questionText: "데이터 속성 간의 종속성에 대한 엄밀한 고려 없이 잘못 설계된 데이터베이스에서는 데이터 처리 연산 수행 시 각종 이상 현상이 발생할 수 있는데, 이러한 이상 현상이 아닌 것은?",
  },
  "2025-3-57": {
    questionText: "관계형 데이터베이스에서 다음 설명에 해당하는 키(Key)는?\n\n한 릴레이션 내의 속성들의 집합으로 구성된 키로서, 릴레이션을 구성하는 모든 튜플에 대한 유일성은 만족시키지만 최소성은 만족시키지 못한다.",
  },
  "2025-3-58": {
    choices: { D: "트랜잭션의 인터페이스를 설계하며, 데이터 타입 및 데이터 타입들 간의 관계로 표현한다." },
  },
  "2025-3-59": { isSql: false },
  "2025-3-61": {
    correctAnswer: "D",
    needsReview: true,
    reviewReasons: ["원본 정답표는 ③이나, /는 산술 연산자이고 =는 대입 연산자이므로 정답을 ④로 교정"],
  },
  "2025-3-62": {
    questionText: `다음 C 언어 프로그램의 결과로 옳은 것은?

#include <stdio.h>

main() {
    int i = 0;
    while (1) {
        if (i == 4)
            break;
        i++;
    }
    printf("%d", i);
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-3-63": {
    choices: {
      A: "IPv4는 각 부분을 옥텟으로 구성하며, 총 32비트로 구성된다.",
      C: "IPv4는 네트워크 부분의 길이에 따라 A 클래스에서 E 클래스까지 총 5단계로 구성되어 있다.",
    },
  },
  "2025-3-64": {
    questionText: `정수를 입력받아 처리하는 다음 C 언어 프로그램에서 괄호에 들어갈 알맞은 코드는?

#include <stdio.h>

int main(void) {
    int n, sum = 3;
    ( )
    sum = sum + n;
    printf("%d", sum);
}`,
    choices: {
      A: "scanf(\"%d\", n);",
      B: "scanf(\"%d\", &n);",
      C: "scanf(\"%f\", n);",
      D: "scanf(\"%f\", &n);",
    },
    isCode: true,
    removeAssets: true,
  },
  "2025-3-65": {
    questionText: `다음은 n각형을 화면에 그리는 프로그램을 Python으로 구현한 것이다. 괄호 (㉠~㉢)에 들어갈 알맞은 코드는?

import turtle

(㉠) shape(distance, n):
    t = turtle.Turtle()
    for i in range(n):
        t.(㉡)
        t.(㉢)

shape(100, 5)`,
    choices: {
      A: "def, forward(distance), left(360//n)",
      B: "def, forward(distance), left(360///n)",
      C: "class, forward(distance), left(360//n)",
      D: "class, forward(distance), left(360///n)",
    },
    isCode: true,
    hasImageReference: false,
    removeAssets: true,
  },
  "2025-3-66": {
    questionText: `다음 Java 프로그램이 실행되었을 때의 결과는?

public class ovr {
    public static void main(String[] args) {
        int a = 1, b = 2, c = 3, d = 4;
        int mx, mn;
        mx = a < b ? b : a;
        if (mx == 1) {
            mn = a > mx ? b : a;
        } else {
            mn = b < mx ? d : c;
        }
        System.out.println(mn);
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2025-3-68": {
    choices: {
      A: "프로세스가 준비 상태에서 프로세서가 배당되어 실행 상태로 변화하는 것을 디스패치(Dispatch)라고 한다.",
      D: "프로세스는 스레드(Thread) 내에서 실행되는 흐름의 단위이며, 스레드와 달리 주소 공간에 실행 스택(Stack)이 없다.",
    },
  },
  "2025-3-71": {
    choices: {
      A: "레코드들이 순차적으로 처리되므로 대화식 처리보다 일괄 처리에 적합하다.",
      B: "연속적인 레코드의 저장에 의해 레코드 사이에 빈 공간이 존재하지 않으므로 기억장치의 효율적인 이용이 가능하다.",
      D: "필요한 레코드를 삽입, 삭제, 수정하는 경우 파일을 재구성할 필요가 없으므로 파일 전체를 복사하지 않아도 된다.",
    },
    isCode: false,
  },
  "2025-3-72": {
    questionText: `다음과 같은 형태로 임계 구역의 접근을 제어하는 상호배제 기법은?

P(S):
    while S <= 0 do skip;
    S := S - 1;
V(S):
    S := S + 1;`,
    isCode: true,
    removeAssets: true,
  },
  "2025-3-73": {
    questionText: `다음 Python 코드에서 '53t44'를 입력했을 때 출력 결과는?

a, b = map(int, input().split('t'))
print(a, b)`,
    isCode: true,
    removeAssets: true,
  },
  "2025-3-76": {
    choices: { B: "안정성은 어떤 문제가 생겼는지, 언제 발생했는지 등을 추적할 수 있어야 한다." },
  },
  "2025-3-77": {
    questionText: "빈 기억공간의 크기가 20K, 16K, 8K, 40K일 때 기억장치 배치 전략으로 ‘Worst Fit’을 사용하여 17K의 프로그램을 적재할 경우 내부 단편화의 크기는?",
  },
  "2025-3-79": {
    choices: { A: "변수는 어떤 값을 주기억장치에 기억하기 위해서 사용하는 공간이다." },
  },
  "2025-3-80": {
    choices: { D: "SJF 기법을 보완하기 위한 스케줄링 방법이다." },
  },
  "2025-3-81": {
    questionText: "다음 내용이 설명하는 기술로 가장 적절한 것은?\n\n• 다른 국을 향하는 호출이 중계에 의하지 않고 직접 접속되는 그물 모양의 네트워크이다.\n• 통신량이 많은 비교적 소수의 국 사이에 구성될 경우 경제적이며 간편하지만, 다수의 국 사이에는 회선이 세분화되어 비경제적일 수도 있다.\n• 해당 형태의 무선 네트워크의 경우 대용량을 빠르고 안전하게 전달할 수 있어 행사장이나 군 등에서 많이 활용된다.",
  },
  "2025-3-82": {
    choices: {
      A: "Ping of Death 공격은 정상 크기보다 큰 ICMP 패킷을 작은 조각(Fragment)으로 쪼개어 공격 대상이 조각화된 패킷을 처리하게 만드는 공격 방법이다.",
      C: "SYN Flooding은 존재하지 않는 클라이언트가 서버별로 한정된 접속 가능 공간에 접속한 것처럼 속여 다른 사용자가 서비스를 이용하지 못하게 하는 것이다.",
    },
  },
  "2025-3-84": {
    questionText: "다음 내용이 설명하는 것은?\n\n• 네트워크상에 광채널 스위치의 이점인 고속 전송과 장거리 연결 및 멀티 프로토콜 기능을 활용\n• 각기 다른 운영체제를 가진 여러 기종들이 네트워크상에서 동일 저장장치의 데이터를 공유하게 함으로써, 여러 개의 저장장치나 백업 장비를 단일화시킨 시스템",
  },
  "2025-3-86": {
    questionText: "다음 내용이 설명하는 것은?\n\n• 사물통신, 사물인터넷과 같이 대역폭이 제한된 통신 환경에 최적화하여 개발된 푸시 기술 기반의 경량 메시지 전송 프로토콜\n• 메시지 매개자(Broker)를 통해 송신자가 특정 메시지를 발행하고 수신자가 메시지를 구독하는 방식\n• IBM이 주도하여 개발",
  },
  "2025-3-87": {
    questionText: "다음이 설명하는 용어로 옳은 것은?\n\n• 오픈 소스를 기반으로 한 분산 컴퓨팅 플랫폼이다.\n• 일반 PC급 컴퓨터들로 가상화된 대형 스토리지를 형성한다.\n• 다양한 소스를 통해 생성된 빅데이터를 효율적으로 저장하고 처리한다.",
    choices: { D: "멤리스터(Memristor)" },
  },
  "2025-3-88": {
    choices: { A: "보헴이 제안한 원시 프로그램의 규모에 의한 비용 예측 모형이다." },
  },
  "2025-3-91": {
    choices: {
      A: "Something You Have",
      B: "Something You Are",
      C: "Something You Know",
      D: "Somewhere You Are",
    },
    hasImageReference: false,
    needsReview: true,
    reviewReasons: ["원본 PDF에서 네 번째 선택지 번호도 ③으로 잘못 인쇄되어 화면용 선택지 D로 복원"],
    removeAssets: true,
  },
  "2025-3-93": {
    choices: {
      A: "UDP 53 포트 - SNMP",
      B: "TCP 23 포트 - Telnet",
      C: "UDP 69 포트 - TFTP",
      D: "TCP/UDP 111 포트 - RPC",
    },
    needsReview: true,
    reviewReasons: ["원본 PDF의 UTP/RFC 오자를 프로토콜 문맥과 원본 정답 ①에 맞춰 UDP/RPC로 교정"],
  },
  "2025-3-95": {
    choices: {
      C: "자원 삽입: 악의적인 명령어가 포함된 스크립트 파일을 업로드함으로써 시스템에 손상을 준다.",
      D: "운영체제 명령어 삽입: 외부 입력값을 통해 시스템 명령어의 실행을 유도함으로써 권한을 탈취하거나 시스템 장애를 유발한다.",
    },
    isSql: false,
  },
  "2025-3-97": {
    questionText: "위조된 매체 접근 제어(MAC) 주소를 지속적으로 네트워크로 흘려보내, 스위치 MAC 주소 테이블의 저장 기능을 혼란시켜 더미 허브(Dummy Hub)처럼 작동하게 하는 공격은?",
  },
  "2025-3-98": {
    questionText: "국내 IT 서비스 경쟁력 강화를 목표로 개발되었으며 인프라 제어 및 관리 환경, 실행 환경, 개발 환경, 서비스 환경, 운영 환경으로 구성되어 있는 개방형 클라우드 컴퓨팅 플랫폼은?",
  },
} satisfies Record<string, ExamCorrection2025>;

/** 전체 페이지 대신 문제 풀이에 필요한 실제 도형만 표시하기 위한 크롭 명세. */
export const crops2025 = [
  {
    id: "2025-1-24",
    year: 2025,
    round: 1,
    questionNo: 24,
    page: 2,
    x: 480,
    y: 385,
    width: 170,
    height: 125,
    filename: "question-24-tree.png",
    altText: "24번 트리 차수 문제의 원본 트리 그림",
  },
  {
    id: "2025-2-26",
    year: 2025,
    round: 2,
    questionNo: 26,
    page: 2,
    x: 480,
    y: 513,
    width: 205,
    height: 133,
    filename: "question-26-preorder-tree.png",
    altText: "26번 전위 순회 문제의 원본 트리 그림",
  },
  {
    id: "2025-3-26",
    year: 2025,
    round: 3,
    questionNo: 26,
    page: 2,
    x: 485,
    y: 488,
    width: 185,
    height: 112,
    filename: "question-26-control-flow.png",
    altText: "26번 McCabe 순환 복잡도 문제의 제어 흐름 그래프",
  },
  {
    id: "2025-3-29",
    year: 2025,
    round: 3,
    questionNo: 29,
    page: 2,
    x: 485,
    y: 945,
    width: 185,
    height: 112,
    filename: "question-29-inorder-tree.png",
    altText: "29번 중위 순회 문제의 원본 트리 그림",
  },
] satisfies ExamCrop2025[];
