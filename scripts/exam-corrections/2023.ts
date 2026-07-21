export type ChoiceKey2023 = "A" | "B" | "C" | "D";

export type ExamCorrection2023 = {
  /** 화면에 표시할 교정 본문. originalQuestionText는 건드리지 않는다. */
  questionText?: string;
  /** 화면에 표시할 normalized 선택지만 문항별로 덮어쓴다. */
  choices?: Partial<Record<ChoiceKey2023, string>>;
  correctAnswer?: ChoiceKey2023;
  originalAnswerText?: string;
  isCode?: boolean;
  isSql?: boolean;
  hasImageReference?: boolean;
  needsReview?: boolean;
  reviewReasons?: string[];
  /** 기존의 잘못된 전체 페이지 자산을 비우고, crops2023의 결과를 연결한다. */
  removeAssets?: boolean;
};

/**
 * 2023년 1~3회 원본 PDF를 대조해 확정한 문항별 교정값이다.
 *
 * 원문 보존 필드(originalQuestionText, choices.*.original)는 수정 대상이 아니다.
 * 이 객체의 questionText와 choices 값은 사용자 화면용 normalized 값이다.
 */
export const corrections2023 = {
  // 2023년 1회
  "2023-1-1": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2023-1-2": {
    questionText: "XP(eXtreme Programming)의 5가지 가치로 거리가 먼 것은?",
  },
  "2023-1-3": {
    choices: {
      B: "독립적인 애플리케이션을 하나의 통합된 시스템으로 묶기 위한 역할을 한다.",
    },
  },
  "2023-1-4": {
    questionText: "자료 흐름도(DFD)를 작성하는 데 지침이 될 수 없는 항목은?",
  },
  "2023-1-5": {
    questionText:
      "설계 기법 중 하향식 설계 방법과 상향식 설계 방법에 대한 비교 설명으로 가장 옳지 않은 것은?",
    choices: {
      C: "상향식 설계는 최하위 수준에서 각각의 모듈들을 설계하고 이러한 모듈이 완성되면 이들을 결합하여 검사한다.",
    },
    correctAnswer: "B",
    originalAnswerText: "④",
    isCode: false,
    hasImageReference: false,
    needsReview: true,
    reviewReasons: [
      "원본 정답표는 ④이나, 하향식 설계에서는 하위 데이터 구조의 세부 사항이 초기 단계부터 필요하지 않으므로 정답 B로 교정함",
    ],
    removeAssets: true,
  },
  "2023-1-6": {
    choices: {
      C: "개발될 시스템에 대하여 여러 분야의 엔지니어들이 공통된 개념을 공유하는 데 도움을 준다.",
    },
  },
  "2023-1-8": {
    questionText:
      "분산 시스템을 위한 마스터-슬레이브(Master-Slave) 아키텍처에 대한 설명으로 틀린 것은?",
    choices: {
      B: "마스터 프로세스는 일반적으로 연산, 통신 조정을 책임진다.",
    },
  },
  "2023-1-9": {
    choices: {
      A: "E-R 다이어그램을 사용하여 객체의 행위를 데이터 모델링하는 데 초점을 둔 방법이다.",
      D: "Use Case를 강조하여 사용하는 방법이다.",
    },
  },
  "2023-1-16": {
    choices: {
      B: "동작하는 소프트웨어보다는 포괄적인 문서를 가치 있게 여긴다.",
    },
  },
  "2023-1-18": { isCode: false },
  "2023-1-19": {
    questionText:
      "입력되는 데이터를 컴퓨터의 프로세서가 처리하기 전에 미리 처리하여 프로세서가 처리하는 시간을 줄여주는 프로그램이나 하드웨어를 말하는 것은?",
  },
  "2023-1-20": {
    choices: {
      D: "이해관계자들의 품질 요구사항을 반영하여 품질 속성을 결정한다.",
    },
  },
  "2023-1-23": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2023-1-25": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-1-26": {
    questionText:
      "다음 Postfix로 표현된 연산식의 연산 결과로 옳은 것은?\n\n3 4 * 5 6 * +",
  },
  "2023-1-28": {
    choices: {
      A: "디지털 콘텐츠와 디바이스의 사용을 제한하기 위해 하드웨어 제조업자, 저작권자, 출판업자 등이 사용할 수 있는 접근 제어 기술을 의미한다.",
      C: "클리어링 하우스(Clearing House)는 사용자에게 콘텐츠 라이선스를 발급하고 권한을 부여해 주는 시스템을 말한다.",
    },
  },
  "2023-1-29": { isCode: false },
  "2023-1-30": {
    questionText:
      "다음과 같이 레코드가 구성되어 있을 때, 이진 검색 방법으로 14를 찾을 경우 비교되는 횟수는?\n\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    isCode: false,
  },
  "2023-1-32": {
    choices: {
      B: "테스트 데이터를 이용해 실제 프로그램을 실행함으로써 오류를 찾는 동적 테스트(Dynamic Test)에 해당한다.",
      C: "프로그램의 구조를 고려하지 않기 때문에 테스트 케이스는 프로그램 또는 모듈의 요구나 명세를 기초로 결정한다.",
    },
    isCode: false,
  },
  "2023-1-34": {
    choices: {
      C: "휴리스틱 오라클: 특정 테스트 케이스의 입력 값에 대해 기대하는 결과를 제공하고, 나머지 입력 값들에 대해서는 추정으로 처리하는 오라클이다.",
      D: "일관성 검사 오라클: 애플리케이션의 변경이 있을 경우 테스트 케이스의 수행 전과 후의 결과 값이 동일한지를 확인하는 오라클이다.",
    },
  },
  "2023-1-36": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-1-37": {
    questionText:
      "다음 초기 자료에 대하여 삽입 정렬(Insertion Sort)을 이용하여 오름차순 정렬할 경우 1회전 후의 결과는?\n\n초기 자료: 8, 3, 4, 9, 7",
  },
  "2023-1-42": {
    questionText:
      "테이블 두 개를 조인하여 뷰 V_1을 정의하고, V_1을 이용하여 뷰 V_2를 정의하였다. 다음 명령 수행 후 결과로 옳은 것은?\n\nDROP VIEW V_1 CASCADE;",
  },
  "2023-1-44": {
    questionText: `다음 <사원> 테이블에 대해 SQL문을 실행했을 때 생성되는 튜플 수는?

| 사원ID | 사원명 | 급여 | 부서ID |
|---:|---|---:|---:|
| 101 | 박철수 | 30000 | 1 |
| 102 | 한나라 | 35000 | 2 |
| 103 | 김감동 | 40000 | 3 |
| 104 | 이구수 | 35000 | 2 |
| 105 | 최초록 | 40000 | 3 |

SELECT 급여
FROM 사원;`,
  },
  "2023-1-46": {
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
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-1-47": {
    questionText:
      "제3정규형(3NF)에서 BCNF(Boyce-Codd Normal Form)가 되기 위한 조건은?",
  },
  "2023-1-49": { isCode: false },
  "2023-1-50": {
    questionText:
      "트랜잭션의 상태 중 트랜잭션의 마지막 연산이 실행된 직후의 상태로, 모든 연산의 처리는 끝났지만 트랜잭션이 수행한 최종 결과를 데이터베이스에 반영하지 않은 상태는?",
  },
  "2023-1-52": {
    choices: {
      D: "기본 사용 형식은 'DELETE FROM 테이블 [WHERE 조건];'이다.",
    },
  },
  "2023-1-53": {
    questionText:
      "관계 대수식 π이름(σ학과='교육'(학생))을 SQL 질의로 옳게 표현한 것은?",
    choices: {
      A: "SELECT 학생 FROM 이름 WHERE 학과 = '교육';",
      B: "SELECT 이름 FROM 학생 WHERE 학과 = '교육';",
      C: "SELECT 교육 FROM 학과 WHERE 이름 = '학생';",
      D: "SELECT 학과 FROM 학생 WHERE 이름 = '교육';",
    },
  },
  "2023-1-54": {
    choices: {
      D: "데이터베이스 설계 및 소프트웨어 개발이 쉽고, 전반적인 시스템의 성능이 향상된다.",
    },
  },
  "2023-1-55": {
    questionText: `다음 관계형 데이터 모델에 대한 설명으로 옳은 것은?

| 고객ID | 고객이름 | 거주도시 |
|---|---|---|
| S1 | 홍길동 | 서울 |
| S2 | 이정재 | 인천 |
| S3 | 신보라 | 인천 |
| S4 | 김흥국 | 서울 |
| S5 | 도요새 | 용인 |`,
  },
  "2023-1-58": {
    choices: {
      A: "SELECT 학생명 FROM 학적 WHERE 전화번호 DON'T NULL;",
      B: "SELECT 학생명 FROM 학적 WHERE 전화번호 != NOT NULL;",
    },
  },
  "2023-1-59": {
    questionText: `릴레이션의 특징으로 옳은 내용 모두를 나열한 것은?

㉠ 모든 튜플은 서로 다른 값을 갖는다.
㉡ 각 속성은 릴레이션 내에서 유일한 이름을 가진다.
㉢ 하나의 릴레이션에서 튜플의 순서는 없다.
㉣ 모든 속성 값은 원자 값이다.`,
  },
  "2023-1-60": {
    choices: {
      D: "뷰가 정의된 기본 테이블이 삭제되더라도 뷰는 자동적으로 삭제되지 않는다.",
    },
  },
  "2023-1-62": {
    correctAnswer: "D",
    needsReview: true,
    reviewReasons: ["원본 정답표는 ③이나, /는 산술 연산자이고 =는 대입 연산자이므로 정답을 ④로 교정"],
  },
  "2023-1-63": {
    choices: { A: "128비트의 주소 공간을 제공한다." },
  },
  "2023-1-64": {
    questionText:
      "다음 설명의 ㉠과 ㉡에 들어갈 내용으로 옳은 것은?\n\n가상기억장치의 일반적인 구현 방법에는 프로그램을 고정된 크기의 일정한 블록으로 나누는 ㉠ 기법과 가변적인 크기의 블록으로 나누는 ㉡ 기법이 있다.",
    choices: {
      B: "㉠: Segmentation, ㉡: Allocation",
    },
  },
  "2023-1-65": {
    choices: {
      A: "변수는 어떤 값을 주기억장치에 기억하기 위해서 사용하는 공간이다.",
    },
  },
  "2023-1-66": {
    choices: {
      A: "반복, 스택, 부프로그램은 시간 지역성(Temporal Locality)과 관련이 있다.",
      B: "공간 지역성(Spatial Locality)은 프로세스가 어떤 페이지를 참조했다면 이후 가상 주소 공간상 그 페이지와 인접한 페이지들을 참조할 가능성이 높음을 의미한다.",
    },
  },
  "2023-1-67": {
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
  },
  "2023-1-71": {
    questionText: `다음 C 언어 프로그램의 결과로 옳은 것은?

#include <stdio.h>

int main(void) {
    int a = 3, b = 4, c = 5;
    int r1, r2, r3;
    r1 = a < 4 && b <= 4;
    r2 = a > 3 || b <= 5;
    r3 = !c;
    printf("%d", r1 - r2 + r3);
    return 0;
}`,
    isCode: true,
  },
  "2023-1-73": {
    choices: {
      C: "셸(Shell)은 프로세스 관리, 기억장치 관리, 입출력 관리 등의 기능을 수행한다.",
    },
  },
  "2023-1-75": {
    questionText:
      "192.168.1.0/24 네트워크를 FLSM 방식을 이용하여 4개의 Subnet으로 나누고 IP Subnet-zero를 적용했다. 이때 Subnetting된 네트워크 중 4번째 네트워크의 4번째 사용 가능한 IP는 무엇인가?",
  },
  "2023-1-76": {
    questionText: `다음 C 언어 프로그램의 !a && !b와 동일한 의미를 가지는 것은?

#include <stdio.h>

main() {
    int a, b;
    for (a = 0; a < 2; a++)
        for (b = 0; b < 2; b++)
            printf("%d", !a && !b);
}`,
    choices: {
      A: "!a || !b",
      B: "!(a || b)",
      C: "a && b",
      D: "a || b",
    },
    isCode: true,
  },
  "2023-1-78": {
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
  },
  "2023-1-80": {
    questionText: `다음 Python 프로그램이 실행되었을 때, 실행 결과는?

a = 100
list_data = ['a', 'b', 'c']
dict_data = {'a': 90, 'b': 95}
print(list_data[0])
print(dict_data['a'])`,
    choices: {
      A: "a\n90",
      B: "100\n90",
      C: "100\n100",
      D: "a\na",
    },
    isCode: true,
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-1-81": {
    questionText:
      "TCP/IP 기반 네트워크에서 동작하는 발행·구독 기반의 메시징 프로토콜로 최근 IoT 환경에서 자주 사용되고 있는 프로토콜은?",
  },
  "2023-1-82": {
    questionText:
      "악성코드의 유형 중 다른 컴퓨터의 취약점을 이용하여 스스로 전파하거나 메일로 전파되며 스스로를 증식하는 것은?",
    isCode: false,
  },
  "2023-1-85": {
    questionText:
      "COCOMO Model 중 기관 내부에서 개발된 중소 규모의 소프트웨어로, 일괄 자료 처리나 과학기술 계산용, 비즈니스 자료 처리용이며 5만 라인 이하의 소프트웨어를 개발하는 유형은?",
    choices: {
      A: "Embedded",
      D: "Semi-Embedded",
    },
  },
  "2023-1-86": {
    choices: {
      B: "Perry에 의해 제안되었으며 세부적인 테스트 과정으로 구성되어 신뢰도 높은 시스템을 개발하는 데 효과적이다.",
      C: "개발 작업과 검증 작업 사이의 관계를 명확히 드러내 놓은 폭포수 모델의 변형이라고 볼 수 있다.",
    },
  },
  "2023-1-87": {
    questionText: `다음이 설명하는 용어로 옳은 것은?

• 오픈 소스를 기반으로 한 분산 컴퓨팅 플랫폼이다.
• 일반 PC급 컴퓨터들로 가상화된 대형 스토리지를 형성한다.
• 다양한 소스를 통해 생성된 빅데이터를 효율적으로 저장하고 처리한다.`,
    choices: {
      D: "멤리스터(Memristor)",
    },
  },
  "2023-1-88": { isSql: false },
  "2023-1-89": {
    choices: {
      C: "소프트웨어를 개발하면서 발생할 수 있는 위험을 관리하고 최소화하는 것을 목적으로 한다.",
    },
  },
  "2023-1-90": {
    questionText: `다음 내용이 설명하는 것은?

• 네트워크상에 광채널 스위치의 이점인 고속 전송과 장거리 연결 및 멀티 프로토콜 기능을 활용한다.
• 각기 다른 운영체제를 가진 여러 기종들이 네트워크상에서 동일 저장장치의 데이터를 공유하게 함으로써, 여러 개의 저장장치나 백업 장비를 단일화시킨 시스템이다.`,
  },
  "2023-1-91": {
    choices: {
      B: "소유: 주체는 '그가 가지고 있는 것'을 보여주며 예시로는 토큰, 스마트카드 등이 있다.",
      D: "행위: 주체는 '그가 하는 것'을 보여주며 예시로는 서명, 움직임, 음성 등이 있다.",
    },
  },
  "2023-1-93": {
    questionText: `정보시스템과 관련한 다음 설명에 해당하는 것은?

• 각 시스템 간에 공유 디스크를 중심으로 클러스터링으로 엮어 다수의 시스템을 동시에 연결할 수 있다.
• 조직, 기업의 기간 업무 서버 안정성을 높이기 위해 사용될 수 있다.
• 여러 가지 방식으로 구현되며 2개의 서버를 연결하는 것으로 2개의 시스템이 각각 업무를 수행하도록 구현하는 방식이 널리 사용된다.`,
  },
  "2023-1-95": { isCode: false },
  "2023-1-97": {
    choices: {
      A: "프로젝트 수행 시 예상되는 변화를 배제하고 신속히 진행하여야 한다.",
      B: "프로젝트에 최적화된 개발 방법론을 적용하기 위해 절차, 산출물 등을 적절히 변경하는 활동이다.",
      C: "관리 측면에서의 목적 중 하나는 최단기간에 안정적인 프로젝트 진행을 위한 사전 위험을 식별하고 제거하는 것이다.",
    },
  },
  "2023-1-99": {
    choices: {
      D: "서로 연결되어 있는 컴퓨터 간 원격 명령 실행이나 셸 서비스 등을 수행한다.",
    },
  },
  "2023-1-100": {
    choices: {
      B: "국내에서는 공인인증제의 폐지와 전자서명법 개정을 추진하면서 클라우드 HSM 용어가 자주 등장하였다.",
    },
  },

  // 2023년 2회
  "2023-2-2": {
    choices: {
      B: "독립적인 애플리케이션을 하나의 통합된 시스템으로 묶기 위한 역할을 한다.",
    },
  },
  "2023-2-5": {
    choices: { A: "Data Coupling" },
  },
  "2023-2-9": {
    questionText: "XP(eXtreme Programming)의 5가지 가치로 거리가 먼 것은?",
  },
  "2023-2-15": {
    questionText:
      "럼바우(Rumbaugh) 분석 기법에서 정보 모델링이라고도 하며, 시스템에서 요구되는 객체를 찾아내어 속성과 연산을 식별하고 객체들 간의 관계를 규정하여 다이어그램으로 표시하는 모델링은?",
  },
  "2023-2-18": {
    choices: {
      B: "서브시스템이 입력 데이터를 받아 처리하고 결과를 다음 서브시스템으로 넘겨주는 과정을 반복한다.",
    },
  },
  "2023-2-21": { isCode: false },
  "2023-2-23": {
    choices: {
      D: "같은 클래스에 속하는 개개의 객체이자 하나의 클래스에서 생성된 객체를 인스턴스(Instance)라고 한다.",
    },
  },
  "2023-2-24": {
    questionText: `다음 설명에 부합하는 용어로 옳은 것은?

• 소프트웨어 구조를 이루며, 다른 것들과 구별될 수 있는 독립적인 기능을 갖는 단위이다.
• 하나 또는 몇 개의 논리적인 기능을 수행하기 위한 명령어들의 집합이라고도 할 수 있다.
• 서로 모여 하나의 완전한 프로그램으로 만들어질 수 있다.`,
  },
  "2023-2-25": {
    questionText:
      "스택(Stack)에 대한 설명으로 틀린 것은?",
  },
  "2023-2-30": {
    choices: {
      D: "설치 매뉴얼에는 목차, 개요, 기본 사항 등이 기본적으로 포함되어야 한다.",
    },
  },
  "2023-2-36": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-2-37": { isCode: false },
  "2023-2-39": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-2-44": {
    questionText: `다음은 관계 대수의 수학적 표현식이다. 해당되는 연산은?

R × S = { r·s | r ∈ R ∧ s ∈ S }
r = <a₁, a₂, …, aₙ>, s = <b₁, b₂, …, bₘ>`,
    isCode: false,
  },
  "2023-2-45": {
    choices: {
      A: "라운드 로빈",
    },
  },
  "2023-2-46": {
    choices: {
      B: "물리적으로 분산되어 지역별로 필요한 데이터를 처리할 수 있는 지역 컴퓨터(Local Computer)를 분산 처리기(Distributed Processor)라고 한다.",
    },
  },
  "2023-2-47": {
    questionText:
      "스키마의 종류 중 조직이나 기관의 총괄적 입장에서 본 데이터베이스의 전체적인 논리적 구조로서 모든 응용 프로그램이나 사용자들이 필요로 하는 데이터를 종합한 조직 전체의 데이터베이스 구조를 의미하는 것은?",
  },
  "2023-2-48": {
    choices: { A: "SELECT 학생명 FROM 학적 WHERE 전화번호 DON'T NULL;" },
  },
  "2023-2-50": {
    questionText: `다음 SQL문이 뜻하는 것은 무엇인가?

INSERT INTO 컴퓨터과테이블(학번, 이름, 학년)
SELECT 학번, 이름, 학년
FROM 학생테이블
WHERE 학과 = '컴퓨터';`,
    choices: {
      A: "학생테이블에서 학과가 컴퓨터인 사람의 학번, 이름, 학년을 검색하라.",
      B: "학생테이블에 학과가 컴퓨터인 사람의 학번, 이름, 학년을 삽입하라.",
      C: "학생테이블에서 학과가 컴퓨터인 사람의 학번, 이름, 학년을 검색하여 컴퓨터과테이블에 삽입하라.",
      D: "컴퓨터과테이블에서 학과가 컴퓨터인 사람의 학번, 이름, 학년을 검색하여 학생테이블에 삽입하라.",
    },
  },
  "2023-2-51": {
    questionText:
      "릴레이션 R의 차수(Degree)가 3, 카디널리티(Cardinality)가 3, 릴레이션 S의 차수가 4, 카디널리티가 4일 때, 두 릴레이션을 카티션 프로덕트(Cartesian Product)한 결과 릴레이션의 차수와 카디널리티는?",
  },
  "2023-2-52": {
    questionText: `다음 표와 같은 판매실적 테이블에서 서울 지역에 한하여 판매액 내림차순으로 지점명과 판매액을 출력하고자 한다. 가장 적절한 SQL문은?

| 도시 | 지점명 | 판매액 |
|---|---|---:|
| 서울 | 강남 지점 | 330 |
| 서울 | 강북 지점 | 168 |
| 광주 | 광주 지점 | 197 |
| 서울 | 강서 지점 | 158 |
| 서울 | 강동 지점 | 197 |
| 대전 | 대전 지점 | 165 |`,
    choices: {
      A: "SELECT 지점명, 판매액\nFROM 판매실적\nWHERE 도시 = '서울'\nORDER BY 판매액 DESC;",
      B: "SELECT 지점명, 판매액\nFROM 판매실적\nORDER BY 판매액 DESC;",
      C: "SELECT 지점명, 판매액\nFROM 판매실적\nWHERE 도시 = '서울' ASC;",
      D: "SELECT *\nFROM 판매실적\nWHEN 도시 = '서울'\nORDER BY 판매액 DESC;",
    },
  },
  "2023-2-54": {
    questionText: `다음 조건을 모두 만족하는 정규형은?

• 테이블 R에 속한 모든 도메인이 원자값만으로 구성되어 있다.
• 테이블 R에서 키가 아닌 모든 필드가 키에 대해 함수적으로 종속되며, 키의 부분집합이 결정자가 되는 부분 종속이 존재하지 않는다.
• 테이블 R에 존재하는 모든 함수적 종속에서 결정자가 후보키이다.`,
    choices: {
      B: "제1정규형",
      C: "제2정규형",
      D: "제3정규형",
    },
  },
  "2023-2-57": {
    questionText:
      "다음 질의에 대한 SQL문은?\n\n프로젝트 번호(PNO) 1, 2, 3에서 일하는 사원의 주민등록번호(JUNO)를 검색하라.\n(단, 사원 테이블(WORKS)은 프로젝트 번호(PNO), 주민등록번호(JUNO) 필드로 구성된다.)",
  },
  "2023-2-58": {
    questionText:
      "다음 두 릴레이션에서 외래키로 사용된 것은? (단, 밑줄 친 속성은 기본키이다.)\n\n과목(과목번호, 과목명)\n수강(수강번호, 학번, 과목번호, 학기)",
  },
  "2023-2-62": {
    choices: { B: "10.3.2.14" },
  },
  "2023-2-63": {
    questionText: `다음 Python 프로그램이 실행되었을 때, 실행 결과는?

a = 100
list_data = ['a', 'b', 'c']
dict_data = {'a': 90, 'b': 95}
print(list_data[0])
print(dict_data['a'])`,
    choices: {
      A: "a\n90",
      B: "100\n90",
      C: "100\n100",
      D: "a\na",
    },
    isCode: true,
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-2-64": {
    choices: {
      B: "영문 대문자/소문자, 숫자, 밑줄(_)의 사용이 가능하다.",
    },
  },
  "2023-2-65": {
    questionText: `다음 C 언어 프로그램의 !a && !b와 동일한 의미를 가지는 것은?

#include <stdio.h>

main() {
    int a, b;
    for (a = 0; a < 2; a++)
        for (b = 0; b < 2; b++)
            printf("%d", !a && !b);
}`,
    choices: {
      A: "!a || !b",
      B: "!(a || b)",
      C: "a && b",
      D: "a || b",
    },
    isCode: true,
  },
  "2023-2-67": {
    questionText: `HRN 방식으로 스케줄링할 경우, 입력된 작업이 다음과 같을 때 처리되는 작업 순서로 옳은 것은?

| 작업 | 대기 시간 | 서비스(실행) 시간 |
|---|---:|---:|
| A | 5 | 20 |
| B | 40 | 20 |
| C | 15 | 45 |
| D | 20 | 2 |`,
  },
  "2023-2-70": {
    choices: {
      B: "수신 번호 확인(Acknowledgement Number)은 상대편 호스트에서 받으려는 바이트의 번호를 정의한다.",
      C: "체크섬(Checksum)은 데이터를 포함한 세그먼트의 오류를 검사한다.",
      D: "윈도우 크기는 송·수신 측의 버퍼 크기로 최대 크기는 32767bit이다.",
    },
  },
  "2023-2-72": {
    questionText:
      "192.168.1.0/24 네트워크를 FLSM 방식을 이용하여 4개의 Subnet으로 나누고 IP Subnet-zero를 적용했다. 이때 Subnetting된 네트워크 중 4번째 네트워크의 4번째 사용 가능한 IP는 무엇인가?",
  },
  "2023-2-73": {
    choices: {
      A: "상당 부분 C 언어를 사용하여 작성되었으며 이식성이 우수하다.",
      C: "셸(Shell)은 프로세스 관리, 기억장치 관리, 입출력 관리 등의 기능을 수행한다.",
    },
  },
  "2023-2-75": {
    choices: { A: "||" },
  },
  "2023-2-77": {
    questionText: `다음 Java 프로그램의 조건문을 삼항 조건 연산자를 사용하여 옳게 나타낸 것은?

int i = 7, j = 9;
int k;
if (i > j)
    k = i - j;
else
    k = i + j;`,
    choices: {
      A: "int i = 7, j = 9;\nint k;\nk = (i > j) ? (i - j) : (i + j);",
      B: "int i = 7, j = 9;\nint k;\nk = (i < j) ? (i - j) : (i + j);",
      C: "int i = 7, j = 9;\nint k;\nk = (i > j) ? (i + j) : (i - j);",
      D: "int i = 7, j = 9;\nint k;\nk = (i < j) ? (i + j) : (i - j);",
    },
    isCode: true,
  },
  "2023-2-78": { isSql: false },
  "2023-2-79": {
    choices: {
      B: "안정성은 어떤 문제가 생겼는지, 언제 발생했는지 등을 추적할 수 있어야 한다.",
    },
  },
  "2023-2-81": {
    choices: {
      C: "최종 결과물이 만들어지기 전에 의뢰자가 최종 결과물의 일부 혹은 모형을 볼 수 있다.",
    },
  },
  "2023-2-82": {
    questionText:
      "COCOMO Model 중 기관 내부에서 개발된 중소 규모의 소프트웨어로, 일괄 자료 처리나 과학기술 계산용, 비즈니스 자료 처리용이며 5만 라인 이하의 소프트웨어를 개발하는 유형은?",
    choices: {
      A: "Embedded",
      D: "Semi-Embedded",
    },
  },
  "2023-2-86": {
    questionText: `다음이 설명하는 용어로 옳은 것은?

• 오픈 소스를 기반으로 한 분산 컴퓨팅 플랫폼이다.
• 일반 PC급 컴퓨터들로 가상화된 대형 스토리지를 형성한다.
• 다양한 소스를 통해 생성된 빅데이터를 효율적으로 저장하고 처리한다.`,
    choices: { D: "멤리스터(Memristor)" },
  },
  "2023-2-92": {
    choices: {
      A: "프로젝트를 완성하는 데 필요한 man-month로 산정 결과를 나타낼 수 있다.",
      D: "프로젝트 개발 유형에 따라 object, dynamic, function의 3가지 모드로 구분한다.",
    },
    isCode: false,
  },
  "2023-2-97": {
    questionText: `다음 내용이 설명하는 것은?

• 네트워크상에 광채널 스위치의 이점인 고속 전송과 장거리 연결 및 멀티 프로토콜 기능을 활용한다.
• 각기 다른 운영체제를 가진 여러 기종들이 네트워크상에서 동일 저장장치의 데이터를 공유하게 함으로써, 여러 개의 저장장치나 백업 장비를 단일화시킨 시스템이다.`,
  },
  "2023-2-98": {
    questionText: `시스템의 사용자가 로그인하여 명령을 내리는 과정에 대한 시스템의 동작 중 다음 설명에 해당하는 것은?

• 자신의 신원(Identity)을 시스템에 증명하는 과정이다.
• 아이디와 패스워드를 입력하는 과정이 가장 일반적인 예시라고 볼 수 있다.`,
  },

  // 2023년 3회
  "2023-3-2": {
    questionText: "XP(eXtreme Programming)의 5가지 가치로 거리가 먼 것은?",
  },
  "2023-3-3": {
    choices: {
      C: "소프트웨어가 잘 실행되는 데 가치를 둔다.",
    },
  },
  "2023-3-4": {
    questionText:
      "UML에서 활용되는 다이어그램 중 시스템의 동작을 표현하는 행위(Behavioral) 다이어그램에 해당하지 않는 것은?",
  },
  "2023-3-5": {
    questionText:
      "디자인 패턴 사용의 장·단점에 대한 설명으로 거리가 먼 것은?",
    choices: {
      B: "객체지향 설계 및 구현의 생산성을 높이는 데 적합하다.",
    },
  },
  "2023-3-7": {
    hasImageReference: false,
    removeAssets: true,
  },
  "2023-3-8": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-3-12": {
    questionText:
      "순차 다이어그램(Sequence Diagram)과 관련한 설명으로 틀린 것은?",
    choices: {
      B: "시간의 흐름에 따라 객체들이 주고받는 메시지의 전달 과정을 강조한다.",
    },
  },
  "2023-3-18": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2023-3-23": {
    questionText:
      "디지털 저작권 관리(DRM)의 기술 요소가 아닌 것은?",
  },
  "2023-3-24": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2023-3-28": {
    choices: {
      D: "스택은 서브루틴 호출, 인터럽트 처리, 수식 계산 및 수식 표기법에 응용된다.",
    },
  },
  "2023-3-31": {
    questionText:
      "다음 자료를 버블 정렬을 이용하여 오름차순으로 정렬할 경우 Pass 2의 결과는?\n\n9, 6, 7, 3, 5",
  },
  "2023-3-35": {
    questionText:
      "분할 정복(Divide and Conquer)에 기반한 알고리즘으로 피벗(pivot)을 사용하며 최악의 경우 n(n - 1) / 2회의 비교를 수행해야 하는 정렬(Sort)은?",
    choices: { C: "Insertion Sort" },
    isSql: false,
  },
  "2023-3-36": {
    choices: {
      A: "추상화: 하위 클래스/메소드/함수를 통해 애플리케이션의 특성을 간략하게 나타내고, 상세 내용은 상위 클래스/메소드/함수에서 구현한다.",
      D: "중복성: 중복을 최소화할 수 있는 코드를 작성한다.",
    },
    isCode: false,
  },
  "2023-3-37": {
    questionText:
      "순서가 있는 리스트에서 데이터의 삽입(Push), 삭제(Pop)가 한쪽 끝에서 일어나며 LIFO(Last-In-First-Out)의 특징을 가지는 자료 구조는?",
  },
  "2023-3-38": { isCode: false },
  "2023-3-39": {
    questionText:
      "다음과 같이 레코드가 구성되어 있을 때, 이진 검색 방법으로 14를 찾을 경우 비교되는 횟수는?\n\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    isCode: false,
  },
  "2023-3-41": {
    questionText:
      "트랜잭션의 특성 중 다음 설명에 해당하는 것은?\n\n트랜잭션의 연산은 데이터베이스에 모두 반영되든지 아니면 전혀 반영되지 않아야 한다.",
  },
  "2023-3-43": {
    questionText: `STUDENT 테이블에 독일어과 학생 50명, 중국어과 학생 30명, 영어영문학과 학생 50명의 정보가 저장되어 있을 때 다음 두 SQL문의 실행 결과 튜플 수는? (단, DEPT 컬럼은 학과명)

ⓐ SELECT DEPT FROM STUDENT;
ⓑ SELECT DISTINCT DEPT FROM STUDENT;`,
  },
  "2023-3-45": {
    questionText:
      "다음에 해당하는 함수 종속의 추론 규칙은?\n\nX → Y이고 Y → Z이면 X → Z이다.",
  },
  "2023-3-46": { isCode: false },
  "2023-3-47": {
    choices: {
      D: "뷰가 정의된 기본 테이블이 제거되면 뷰도 자동적으로 제거된다.",
    },
  },
  "2023-3-48": {
    hasImageReference: false,
    removeAssets: true,
  },
  "2023-3-49": {
    questionText:
      "정규화된 엔티티, 속성, 관계를 시스템의 성능 향상과 개발·운영의 단순화를 위해 중복, 통합, 분리 등을 수행하는 데이터 모델링 기법은?",
  },
  "2023-3-51": {
    choices: { B: "트랜잭션(Transaction)" },
  },
  "2023-3-54": {
    choices: {
      D: "질의에 대한 해를 구하기 위해 수행해야 할 연산의 순서를 명시한다.",
    },
  },
  "2023-3-55": {
    choices: {
      A: "SELECT 학생명 FROM 학적 WHERE 전화번호 DON'T NULL;",
      B: "SELECT 학생명 FROM 학적 WHERE 전화번호 != NOT NULL;",
    },
  },
  "2023-3-58": {
    choices: {
      C: "데이터베이스에 대한 데이터인 메타데이터(Metadata)를 저장하고 있다.",
    },
  },
  "2023-3-62": { isSql: false },
  "2023-3-63": {
    choices: {
      A: "System.out.print()",
      B: "System.out.println()",
      C: "System.out.printing()",
      D: "System.out.printf()",
    },
  },
  "2023-3-66": {
    questionText: `다음 C 언어 프로그램이 실행되었을 때의 결과는?

#include <stdio.h>

int main(void) {
    int a = 3, b = 4, c = 2;
    int r1, r2, r3;
    r1 = b <= 4 || c == 2;
    r2 = (a > 0) && (b < 5);
    r3 = !c;
    printf("%d", r1 + r2 + r3);
    return 0;
}`,
    isCode: true,
  },
  "2023-3-69": {
    questionText:
      "3개의 보관 구조를 가지는 주기억장치가 있으며, 다음 순서로 페이지 참조가 발생할 때 FIFO 페이지 교체 알고리즘을 사용할 경우 마지막 페이지 값으로 옳은 것은?\n\n페이지 순서: 1, 2, 3, 2, 4, 2, 3, 1, 3",
  },
  "2023-3-72": {
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
  },
  "2023-3-73": {
    questionText: `메모리 관리 기법 중 Worst Fit 방법을 사용할 경우 10K 크기의 프로그램 실행을 위해서는 어느 부분에 할당되는가?

| 영역 번호 | 메모리 크기 | 사용 여부 |
|---|---:|---|
| NO.1 | 8K | FREE |
| NO.2 | 12K | FREE |
| NO.3 | 10K | IN USE |
| NO.4 | 20K | IN USE |
| NO.5 | 16K | FREE |`,
    isCode: false,
  },
  "2023-3-74": {
    questionText:
      "응집도의 종류 중 서로 간에 어떠한 의미 있는 연관 관계도 지니지 않은 기능 요소로 구성되는 경우이며, 서로 다른 상위 모듈에 의해 호출되어 처리상의 연관성이 없는 서로 다른 기능을 수행하는 경우의 응집도는?",
  },
  "2023-3-75": {
    questionText: `다음은 Python으로 작성된 반복문이다. 실행 결과는?

while True:
    print('A')
    print('B')
    print('C')
    continue
    print('D')`,
    isCode: true,
  },
  "2023-3-76": {
    questionText:
      "C 언어에서 연산자 우선순위가 높은 것에서 낮은 것으로 바르게 나열된 것은?\n\n㉠ ()\n㉡ ==\n㉢ <\n㉣ <<\n㉤ ||\n㉥ /",
  },
  "2023-3-77": {
    choices: {
      C: "모듈화는 시스템을 지능적으로 관리할 수 있도록 해주며 복잡도 문제를 해결하는 데 도움을 준다.",
    },
  },
  "2023-3-79": {
    questionText: `a[0]의 주소값이 10일 경우 다음 C 언어 프로그램이 실행되었을 때의 결과는? (단, int형의 크기는 4 Byte로 가정한다.)

#include <stdio.h>

int main(int argc, char* argv[]) {
    int a[] = {14, 22, 30, 38};
    printf("%u, ", &a[2]);
    printf("%u", a);
    return 0;
}`,
    isCode: true,
  },
  "2023-3-80": {
    choices: {
      A: "문자열을 수치 데이터로 바꾸는 문자 변환 함수와 수치를 문자열로 바꿔 주는 변환 함수 등이 있다.",
    },
  },
  "2023-3-81": {
    questionText:
      "TCP/IP 기반 네트워크에서 동작하는 발행·구독 기반의 메시징 프로토콜로 최근 IoT 환경에서 자주 사용되고 있는 프로토콜은?",
  },
  "2023-3-82": {
    questionText:
      "COCOMO Model 중 기관 내부에서 개발된 중소 규모의 소프트웨어로, 일괄 자료 처리나 과학기술 계산용, 비즈니스 자료 처리용이며 5만 라인 이하의 소프트웨어를 개발하는 유형은?",
    choices: {
      A: "Embedded",
      D: "Semi-Embedded",
    },
  },
  "2023-3-84": {
    choices: { B: "명령어(사용자 질의 수)" },
  },
  "2023-3-85": {
    questionText: `다음 내용이 설명하는 스토리지 시스템은?

• 하드디스크와 같은 데이터 저장장치를 호스트 버스 어댑터에 직접 연결하는 방식이다.
• 저장장치와 호스트 기기 사이에 네트워크 디바이스가 없어야 하며 직접 연결하는 방식으로 구성한다.`,
  },
  "2023-3-87": {
    questionText: `다음 내용이 설명하는 접근 제어 모델은?

• 군대의 보안 레벨처럼 정보의 기밀성에 따라 상하 관계가 구분된 정보를 보호하기 위해 사용한다.
• 자신의 권한보다 낮은 보안 레벨 권한을 가진 경우에는 높은 보안 레벨의 문서를 읽을 수 없고, 자신의 권한보다 낮은 수준의 문서만 읽을 수 있다.
• 자신의 권한보다 높은 보안 레벨의 문서에는 쓰기가 가능하지만, 보안 레벨이 낮은 문서의 쓰기 권한은 제한한다.`,
    choices: { C: "Bell-LaPadula Model" },
  },
  "2023-3-88": { isSql: false },
  "2023-3-89": {
    questionText: `다음 설명에 해당하는 시스템은?

• 1990년대 David Clock이 처음 제안하였다.
• 비정상적인 접근의 탐지를 위해 의도적으로 설치해 둔 시스템이다.
• 침입자를 속여 실제 공격당하는 것처럼 보여 줌으로써 크래커를 추적하고 공격 기법의 정보를 수집하는 역할을 한다.
• 쉽게 공격자에게 노출되어야 하며 쉽게 공격이 가능한 것처럼 취약해 보여야 한다.`,
  },
  "2023-3-92": {
    questionText:
      "다음 내용이 설명하는 것은?\n\n개인과 기업, 국가적으로 큰 위협이 되고 있는 주요 사이버 범죄 중 하나로, Snake, DarkSide 등 시스템을 잠그거나 데이터를 암호화해 사용할 수 없도록 하고 이를 인질로 금전을 요구하는 데 사용되는 악성 프로그램이다.",
  },
  "2023-3-94": {
    questionText:
      "메모리상에서 프로그램의 복귀 주소와 변수 사이에 특정 값을 저장해 두었다가 그 값이 변경되었을 경우 오버플로 상태로 가정하여 프로그램 실행을 중단하는 기술은?",
    isCode: false,
  },
  "2023-3-96": {
    choices: {
      A: "컴퓨팅, 네트워킹, 스토리지, 관리 등을 모두 소프트웨어로 정의한다.",
    },
  },
  "2023-3-97": {
    choices: {
      A: "비트/바이트/단어들을 순차적으로 암호화한다.",
      B: "해시 함수를 이용한 해시 암호화 방식을 사용한다.",
      C: "RC4는 스트림 암호화 방식에 해당한다.",
    },
  },
  "2023-3-99": {
    questionText:
      "S/W 각 기능의 원시 코드 라인 수의 비관치, 낙관치, 기대치를 측정하여 예측치를 구하고 이를 이용하여 비용을 산정하는 기법은?",
    choices: { C: "델파이 기법" },
    isCode: false,
  },
  "2023-3-100": {
    choices: {
      A: "프로젝트 수행 시 예상되는 변화를 배제하고 신속히 진행하여야 한다.",
      B: "프로젝트에 최적화된 개발 방법론을 적용하기 위해 절차, 산출물 등을 적절히 변경하는 활동이다.",
      C: "관리 측면에서의 목적 중 하나는 최단기간에 안정적인 프로젝트 진행을 위한 사전 위험을 식별하고 제거하는 것이다.",
    },
  },
} satisfies Record<string, ExamCorrection2023>;

export type ExamCrop2023 = {
  id: string;
  /** 1부터 시작하는 PDF 페이지 번호 */
  pageNumber: number;
  sourcePath: string;
  outputPath: string;
  /** sourcePath PNG(893×1263) 기준 픽셀 좌표 */
  x: number;
  y: number;
  width: number;
  height: number;
  type: "diagram";
  altText: string;
};

/** 전체 페이지 이미지를 문제에 필요한 도형만으로 교체하기 위한 크롭 명세. */
export const crops2023 = [
  {
    id: "2023-1-25",
    pageNumber: 2,
    sourcePath: "data/imported/2023/1/assets/page-2.png",
    outputPath: "data/imported/2023/1/assets/question-25-tree.png",
    x: 480,
    y: 540,
    width: 185,
    height: 125,
    type: "diagram",
    altText: "트리의 차수와 단말 노드 수를 묻는 트리 그림",
  },
  {
    id: "2023-1-36",
    pageNumber: 3,
    sourcePath: "data/imported/2023/1/assets/page-3.png",
    outputPath: "data/imported/2023/1/assets/question-36-tree.png",
    x: 80,
    y: 1025,
    width: 180,
    height: 135,
    type: "diagram",
    altText: "Preorder 순회를 묻는 트리 그림",
  },
  {
    id: "2023-2-36",
    pageNumber: 3,
    sourcePath: "data/imported/2023/2/assets/page-3.png",
    outputPath: "data/imported/2023/2/assets/question-36-control-flow.png",
    x: 85,
    y: 810,
    width: 160,
    height: 135,
    type: "diagram",
    altText: "McCabe 순환 복잡도를 계산하기 위한 제어 흐름 그래프",
  },
  {
    id: "2023-2-39",
    pageNumber: 3,
    sourcePath: "data/imported/2023/2/assets/page-3.png",
    outputPath: "data/imported/2023/2/assets/question-39-dfs-graph.png",
    x: 485,
    y: 145,
    width: 175,
    height: 170,
    type: "diagram",
    altText: "깊이 우선 탐색 순서를 묻는 그래프",
  },
  {
    id: "2023-3-8",
    pageNumber: 1,
    sourcePath: "data/imported/2023/3/assets/page-1.png",
    outputPath: "data/imported/2023/3/assets/question-8-fan-in-out.png",
    x: 490,
    y: 410,
    width: 230,
    height: 150,
    type: "diagram",
    altText: "모듈 F의 fan-in과 fan-out을 묻는 프로그램 구조도",
  },
  {
    id: "2023-3-24",
    pageNumber: 2,
    sourcePath: "data/imported/2023/3/assets/page-2.png",
    outputPath: "data/imported/2023/3/assets/question-24-tree.png",
    x: 470,
    y: 310,
    width: 205,
    height: 145,
    type: "diagram",
    altText: "Preorder 순회를 묻는 트리 그림",
  },
] satisfies ExamCrop2023[];
