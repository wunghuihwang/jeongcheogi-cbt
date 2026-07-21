export type ChoiceKey2022 = "A" | "B" | "C" | "D";

export type ExamCorrection2022 = {
  questionText?: string;
  choices?: Partial<Record<ChoiceKey2022, string>>;
  correctAnswer?: ChoiceKey2022;
  originalAnswerText?: string;
  isCode?: boolean;
  isSql?: boolean;
  hasImageReference?: boolean;
  needsReview?: boolean;
  reviewReasons?: string[];
  removeAssets?: boolean;
};

export type ExamCrop2022 = {
  sourceAsset: string;
  outputAsset: string;
  pageNumber: number;
  type: "diagram" | "choice_diagram";
  altText: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * 2022년 1~3회 PDF를 원문 페이지와 대조해 확정한 화면 표시용 교정값이다.
 * originalQuestionText와 choices.*.original은 이 모듈로 변경하지 않는다.
 */
export const corrections2022 = {
  "2022-1-1": {
    choices: { C: "오류로 인해 발생될 수 있는 부정적인 내용을 적극적으로 사용자들에게 알려야 한다." },
  },
  "2022-1-2": {
    choices: { B: "동작하는 소프트웨어보다는 포괄적인 문서를 가치 있게 여긴다." },
  },
  "2022-1-3": {
    choices: { B: "사용자의 요구를 추출하여 목표를 정하고 어떤 방식으로 해결할 것인지 결정하는 단계이다." },
  },
  "2022-1-5": {
    choices: {
      C: "상향식 설계는 최하위 수준에서 각각의 모듈들을 설계하고 이러한 모듈이 완성되면 이들을 결합하여 검사한다.",
    },
    correctAnswer: "B",
    originalAnswerText: "④",
    needsReview: true,
    reviewReasons: ["원본 정답표는 ④이나, 하향식 설계에서는 하위 데이터 구조의 세부 사항이 초기 단계부터 필요하지 않으므로 정답을 ②로 교정"],
  },
  "2022-1-8": {
    questionText: "다음의 설명에 해당하는 언어는?\n\n객체지향 시스템을 개발할 때 산출물을 명세화, 시각화, 문서화하는 데 사용된다. 즉, 개발하는 시스템을 이해하기 쉬운 형태로 표현하여 분석가, 의뢰인, 설계자가 효율적인 의사소통을 할 수 있게 해 준다. 따라서 개발 방법론이나 개발 프로세스가 아니라 표준화된 모델링 언어이다.",
  },
  "2022-1-9": {
    questionText: "다음 내용이 설명하는 UI 설계 도구는?\n\n• 디자인, 사용 방법 설명, 평가 등을 위해 실제 화면과 유사하게 만든 정적인 형태의 모형\n• 시각적으로만 구성 요소를 배치하는 것으로 일반적으로 실제로 구현되지는 않음",
  },
  "2022-1-19": {
    questionText: "입력되는 데이터를 컴퓨터의 프로세서가 처리하기 전에 미리 처리하여 프로세서가 처리하는 시간을 줄여주는 프로그램이나 하드웨어를 말하는 것은?",
  },
  "2022-1-21": {
    choices: {
      A: "추상화: 하위 클래스/메소드/함수를 통해 애플리케이션의 특성을 간략하게 나타내고, 상세 내용은 상위 클래스/메소드/함수에서 구현한다.",
      D: "중복성: 중복을 최소화할 수 있는 코드를 작성한다.",
    },
    isCode: false,
  },
  "2022-1-23": {
    questionText: "스택(Stack)에 대한 옳은 내용으로만 나열된 것은?\n\n㉠ FIFO 방식으로 처리된다.\n㉡ 순서 리스트의 뒤(Rear)에서 노드가 삽입되며, 앞(Front)에서 노드가 제거된다.\n㉢ 선형 리스트의 양쪽 끝에서 삽입과 삭제가 모두 가능한 자료 구조이다.\n㉣ 인터럽트 처리, 서브루틴 호출 작업 등에 응용된다.",
  },
  "2022-1-29": {
    choices: {
      B: "신규 및 변경 개발 소스를 식별하고, 이를 모듈화하여 상용 제품으로 패키징한다.",
      C: "고객의 편의성을 위해 매뉴얼 및 버전 관리를 지속적으로 한다.",
      D: "범용 환경에서 사용이 가능하도록 일반적인 배포 형태로 패키징이 진행된다.",
    },
  },
  "2022-1-34": { isCode: false },
  "2022-1-36": {
    questionText: "분할 정복(Divide and Conquer)에 기반한 알고리즘으로 피벗(pivot)을 사용하며 최악의 경우 n(n−1)/2회의 비교를 수행해야 하는 정렬(Sort)은?",
    isSql: false,
  },
  "2022-1-39": { isCode: false },
  "2022-1-43": {
    questionText: "어떤 릴레이션 R의 모든 조인 종속성의 만족이 R의 후보키를 통해서만 만족될 때, 이 릴레이션 R이 해당하는 정규형은?",
  },
  "2022-1-44": {
    choices: { A: "원", B: "직사각형", C: "이중 타원", D: "직선" },
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-1-47": {
    questionText: "다음 릴레이션의 Degree와 Cardinality는?\n\n| 학번 | 이름 | 학년 | 학과 |\n|---:|---|---|---|\n| 13001 | 홍길동 | 3학년 | 전기 |\n| 13002 | 이순신 | 4학년 | 기계 |\n| 13003 | 강감찬 | 2학년 | 컴퓨터 |",
    hasImageReference: false,
    removeAssets: true,
  },
  "2022-1-49": {
    questionText: "관계 대수식을 SQL 질의로 옳게 표현한 것은?\n\nπ이름(σ학과='교육'(학생))",
    choices: {
      A: "SELECT 학생 FROM 이름 WHERE 학과 = '교육';",
      B: "SELECT 이름 FROM 학생 WHERE 학과 = '교육';",
      C: "SELECT 교육 FROM 학과 WHERE 이름 = '학생';",
      D: "SELECT 학과 FROM 학생 WHERE 이름 = '교육';",
    },
  },
  "2022-1-52": {
    choices: { B: "데이터 정의어는 기본 테이블, 뷰 테이블 또는 인덱스 등을 생성, 변경, 제거하는 데 사용되는 명령어이다." },
    isCode: false,
  },
  "2022-1-53": {
    questionText: "다음 사원 테이블에 대해 SQL문을 실행했을 때 생성되는 튜플 수는?\n\n| 사원ID | 사원명 | 급여 | 부서ID |\n|---:|---|---:|---:|\n| 101 | 박철수 | 30000 | 1 |\n| 102 | 한나라 | 35000 | 2 |\n| 103 | 김감동 | 40000 | 3 |\n| 104 | 이구수 | 35000 | 2 |\n| 105 | 최초록 | 40000 | 3 |\n\nSELECT 급여\nFROM 사원;",
    hasImageReference: false,
    removeAssets: true,
  },
  "2022-1-54": {
    questionText: "다음 SQL문에서 사용된 BETWEEN 연산의 의미와 동일한 것은?\n\nSELECT *\nFROM 성적\nWHERE (점수 BETWEEN 90 AND 95)\n  AND 학과 = '컴퓨터공학과';",
  },
  "2022-1-57": {
    questionText: "테이블 R과 S에 대해 다음 SQL문이 실행되었을 때, 실행 결과로 옳은 것은?\n\nR\n\n| A | B |\n|---:|---|\n| 1 | A |\n| 3 | B |\n\nS\n\n| A | B |\n|---:|---|\n| 1 | A |\n| 2 | B |\n\nSELECT A FROM R\nUNION ALL\nSELECT A FROM S;",
    choices: { A: "1", B: "3, 2", C: "1, 3", D: "1, 3, 1, 2" },
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2022-1-59": {
    questionText: "테이블 두 개를 조인하여 뷰 V_1을 정의하고, V_1을 이용하여 뷰 V_2를 정의하였다. 다음 명령 수행 후 결과로 옳은 것은?\n\nDROP VIEW V_1 CASCADE;",
  },
  "2022-1-61": {
    choices: { B: "IPv6는 주소 자동 설정(Auto Configuration) 기능을 통해 손쉽게 이용자의 단말을 네트워크에 접속시킬 수 있다." },
  },
  "2022-1-62": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    int arr[2][3] = { 1, 2, 3, 4, 5, 6 };
    int (*p)[3] = NULL;
    p = arr;
    printf("%d, ", *(p[0] + 1) + *(p[1] + 2));
    printf("%d", *(*(p + 1) + 0) + *(*(p + 1) + 1));
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-1-65": {
    choices: { B: "2^128개의 주소를 표현할 수 있다." },
  },
  "2022-1-69": {
    questionText: `다음과 같은 형태로 임계 구역의 접근을 제어하는 상호배제 기법은?

P(S):
    while S <= 0 do skip;
    S := S - 1;
V(S):
    S := S + 1;`,
    isCode: true,
    removeAssets: true,
  },
  "2022-1-72": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    int i = 0;
    while (1) {
        if (i == 4) {
            break;
        }
        ++i;
    }
    printf("i = %d", i);
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-1-73": {
    questionText: `다음 JAVA 프로그램이 실행되었을 때, 실행 결과는?

public class Ape {
    static void rs(char a[]) {
        for (int i = 0; i < a.length; i++)
            if (a[i] == 'B')
                a[i] = 'C';
            else if (i == a.length - 1)
                a[i] = a[i - 1];
            else
                a[i] = a[i + 1];
    }

    static void pca(char a[]) {
        for (int i = 0; i < a.length; i++)
            System.out.print(a[i]);
        System.out.println();
    }

    public static void main(String[] args) {
        char c[] = {'A', 'B', 'D', 'D', 'A', 'B', 'C'};
        rs(c);
        pca(c);
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-1-76": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

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
  "2022-1-77": {
    questionText: "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = 100\nlist_data = ['a', 'b', 'c']\ndict_data = {'a': 90, 'b': 95}\nprint(list_data[0])\nprint(dict_data['a'])",
    choices: { A: "a\n90", B: "100\n90", C: "100\n100", D: "a\na" },
    isCode: true,
    removeAssets: true,
  },
  "2022-1-78": {
    questionText: "C언어에서 정수 변수 a, b에 각각 1, 2가 저장되어 있을 때 다음 식의 연산 결과로 옳은 것은?\n\na < b + 2 && a << 1 <= b",
    isCode: true,
  },
  "2022-1-79": {
    questionText: "다음 Python 프로그램이 실행되었을 때, 실행 결과는?\n\na = ['대', '한', '민', '국']\nfor i in a:\n    print(i)",
    choices: { A: "대한민국", B: "대\n한\n민\n국", C: "대", D: "대대대대" },
    isCode: true,
    removeAssets: true,
  },
  "2022-1-80": { isCode: false },
  "2022-1-81": {
    choices: { C: "시스템을 여러 부분으로 나누어 여러 번의 개발 주기를 거치면서 시스템이 완성된다." },
  },
  "2022-1-82": {
    questionText: "정보시스템과 관련한 다음 설명에 해당하는 것은?\n\n• 각 시스템 간에 공유 디스크를 중심으로 클러스터링으로 엮어 다수의 시스템을 동시에 연결할 수 있다.\n• 조직, 기업의 기간 업무 서버 안정성을 높이기 위해 사용될 수 있다.\n• 여러 가지 방식으로 구현되며 2개의 서버를 연결하는 것으로 2개의 시스템이 각각 업무를 수행하도록 구현하는 방식이 널리 사용된다.",
  },
  "2022-1-83": {
    questionText: "위조된 매체 접근 제어(MAC) 주소를 지속적으로 네트워크로 흘려보내, 스위치 MAC 주소 테이블의 저장 기능을 혼란시켜 더미 허브(Dummy Hub)처럼 작동하게 하는 공격은?",
  },
  "2022-1-84": {
    questionText: "다음 내용이 설명하는 스토리지 시스템은?\n\n• 하드디스크와 같은 데이터 저장장치를 호스트 버스 어댑터에 직접 연결하는 방식\n• 저장장치와 호스트 기기 사이에 네트워크 디바이스 없이 직접 연결하는 방식으로 구성",
  },
  "2022-1-86": {
    choices: {
      B: "Perry에 의해 제안되었으며 세부적인 테스트 과정으로 구성되어 신뢰도 높은 시스템을 개발하는 데 효과적이다.",
      C: "개발 작업과 검증 작업 사이의 관계를 명확히 드러내 놓은 폭포수 모델의 변형이라고 볼 수 있다.",
    },
  },
  "2022-1-88": {
    choices: {
      A: "Ping of Death 공격은 정상 크기보다 큰 ICMP 패킷을 작은 조각(Fragment)으로 쪼개어 공격 대상이 조각화된 패킷을 처리하게 만드는 공격 방법이다.",
      C: "SYN Flooding은 존재하지 않는 클라이언트가 서버별로 한정된 접속 가능 공간에 접속한 것처럼 속여 다른 사용자가 서비스를 이용하지 못하게 하는 것이다.",
    },
  },
  "2022-1-89": {
    questionText: "다음 설명에 해당하는 시스템은?\n\n• 1990년대 David Clock이 처음 제안하였다.\n• 비정상적인 접근의 탐지를 위해 의도적으로 설치해 둔 시스템이다.\n• 침입자를 속여 실제 공격당하는 것처럼 보여줌으로써 크래커를 추적하고 공격 기법의 정보를 수집하는 역할을 한다.\n• 쉽게 공격자에게 노출되어야 하며 쉽게 공격이 가능한 것처럼 취약해 보여야 한다.",
    needsReview: true,
    reviewReasons: ["원본 PDF의 인명 'David Clock'은 출처 자체의 사실·표기 오류 가능성이 있어 원문을 유지하고 별도 검토 필요"],
  },
  "2022-1-91": {
    choices: { A: "프로젝트를 이루는 소작업별로 언제 시작되고 언제 끝나야 하는지를 한눈에 볼 수 있도록 도와준다." },
  },
  "2022-1-93": { isCode: false, isSql: false },
  "2022-1-98": { isCode: false },
  "2022-1-100": {
    choices: {
      A: "프로젝트 수행 시 예상되는 변화를 배제하고 신속히 진행하여야 한다.",
      B: "프로젝트에 최적화된 개발 방법론을 적용하기 위해 절차, 산출물 등을 적절히 변경하는 활동이다.",
    },
  },

  "2022-2-1": {
    choices: { A: "객체 간의 동적 상호작용을 시간 개념을 중심으로 모델링하는 것이다." },
  },
  "2022-2-3": {
    choices: {
      C: "익스트림 프로그래밍을 구동시키는 원리는 상식적인 원리와 경험을 최대한 끌어올리는 것이다.",
      D: "구체적인 실천 방법을 정의하고 있으며, 개발 문서보다는 소스 코드에 중점을 둔다.",
    },
    isCode: false,
  },
  "2022-2-5": {
    choices: { C: "시스템 구축과 관련된 안전, 보안에 대한 요구사항들은 비기능적 요구에 해당하지 않는다." },
    correctAnswer: "B",
    originalAnswerText: "②",
    needsReview: false,
    reviewReasons: [],
  },
  "2022-2-9": {
    choices: {
      C: "메소드 오버라이딩(Overriding)은 상위 클래스에서 정의한 일반 메소드의 구현을 하위 클래스에서 무시하고 재정의할 수 있다.",
      D: "메소드 오버로딩(Overloading)의 경우 매개변수 타입은 동일하지만 메소드명을 다르게 함으로써 구현, 구분할 수 있다.",
    },
    isCode: false,
  },
  "2022-2-13": {
    choices: { B: "프로세스와 도구 중심이 아닌 개개인과의 상호소통을 통해 의견을 수렴한다." },
  },
  "2022-2-17": {
    choices: {
      A: "GUI(Graphical User Interface)",
      D: "CLI(Command Line Interface)",
    },
  },
  "2022-2-18": {
    choices: {
      B: "구조적 방법론에서는 DFD(Data Flow Diagram), DD(Data Dictionary) 등을 사용하여 요구사항의 결과를 표현한다.",
      D: "소프트웨어 모델을 사용할 경우 개발될 소프트웨어에 대한 이해도 및 이해 당사자 간의 의사소통 향상에 도움이 된다.",
    },
  },
  "2022-2-19": {
    choices: {
      B: "유스케이스는 사용자 측면에서의 요구사항으로, 사용자가 원하는 목표를 달성하기 위해 수행할 내용을 기술한다.",
      C: "시스템 액터는 다른 프로젝트에서 이미 개발되어 사용되고 있으며, 본 시스템과 데이터를 주고받는 등 서로 연동되는 시스템을 말한다.",
      D: "액터가 인식할 수 없는 시스템 내부의 기능을 하나의 유스케이스로 파악해서는 안 된다.",
    },
  },
  "2022-2-20": {
    choices: { B: "모델(Model)은 뷰(View)와 제어(Controller) 사이에서 전달자 역할을 하며, 뷰마다 모델 서브시스템이 각각 하나씩 연결된다." },
  },
  "2022-2-21": {
    choices: { D: "모듈 간의 인터페이스와 시스템의 동작이 정상적으로 잘되고 있는지를 빨리 파악하고자 할 때 상향식보다는 하향식 통합 테스트를 사용하는 것이 좋다." },
  },
  "2022-2-22": { isCode: false },
  "2022-2-23": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2022-2-25": {
    choices: { C: "개발된 서비스가 정의된 요구사항을 준수하는지 확인하기 위한 입력값과 실행 조건, 예상 결과의 집합으로 볼 수 있다." },
    isCode: false,
  },
  "2022-2-26": {
    choices: { D: "같은 클래스에 속하는 개개의 객체이자 하나의 클래스에서 생성된 객체를 인스턴스(Instance)라고 한다." },
  },
  "2022-2-27": {
    choices: { C: "클리어링 하우스(Clearing House)는 사용자에게 콘텐츠 라이선스를 발급하고 권한을 부여해 주는 시스템을 말한다." },
  },
  "2022-2-30": { isCode: false },
  "2022-2-31": {
    choices: { C: "정렬(Sorting)은 흩어져 있는 데이터를 키값을 이용하여 순서대로 열거하는 알고리즘이다." },
  },
  "2022-2-33": {
    questionText: "다음은 인스펙션(Inspection) 과정을 표현한 것이다. (가)~(마)에 들어갈 말을 [보기]에서 찾아 바르게 연결한 것은?\n\n[보기]\n㉠ 준비\n㉡ 사전 교육\n㉢ 인스펙션 회의\n㉣ 수정\n㉤ 후속 조치",
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-2-35": {
    choices: { C: "필요 데이터를 인자를 통해 넘겨주고, 테스트 완료 후 그 결과값을 받는 역할을 하는 가상의 모듈을 테스트 스텁(Stub)이라고 한다." },
  },
  "2022-2-36": {
    choices: { A: "Coding - 프로그래밍 언어를 가지고 컴퓨터 프로그램을 작성할 수 있는 환경을 제공" },
  },
  "2022-2-37": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-2-41": {
    questionText: "다음 조건을 모두 만족하는 정규형은?\n\n• 테이블 R에 속한 모든 도메인이 원자값만으로 구성되어 있다.\n• 테이블 R에서 키가 아닌 모든 필드가 키에 대해 함수적으로 종속되며, 키의 부분집합이 결정자가 되는 부분 종속이 존재하지 않는다.\n• 테이블 R에 존재하는 모든 함수적 종속에서 결정자가 후보키이다.",
  },
  "2022-2-42": {
    questionText: "데이터베이스의 트랜잭션 성질들 중에서 다음 설명에 해당하는 것은?\n\n트랜잭션의 모든 연산들이 정상적으로 수행 완료되거나 아니면 전혀 어떠한 연산도 수행되지 않은 원래 상태가 되도록 해야 한다.",
  },
  "2022-2-44": {
    questionText: "다음 테이블을 보고 강남지점의 판매량이 많은 제품부터 출력되도록 할 때 가장 적절한 SQL 구문은? (단, 제품명과 판매량을 출력한다.)\n\n| 지점명 | 제품명 | 판매량 |\n|---|---|---:|\n| 강남지점 | 비빔밥 | 500 |\n| 강북지점 | 도시락 | 300 |\n| 강남지점 | 도시락 | 200 |\n| 강남지점 | 미역국 | 550 |\n| 수원지점 | 비빔밥 | 600 |\n| 인천지점 | 비빔밥 | 800 |\n| 강남지점 | 잡채밥 | 250 |",
    choices: {
      A: "SELECT 제품명, 판매량\nFROM 푸드\nORDER BY 판매량 ASC;",
      B: "SELECT 제품명, 판매량\nFROM 푸드\nORDER BY 판매량 DESC;",
      C: "SELECT 제품명, 판매량\nFROM 푸드\nWHERE 지점명 = '강남지점'\nORDER BY 판매량 ASC;",
      D: "SELECT 제품명, 판매량\nFROM 푸드\nWHERE 지점명 = '강남지점'\nORDER BY 판매량 DESC;",
    },
    isSql: true,
    hasImageReference: false,
    removeAssets: true,
  },
  "2022-2-46": { isCode: false },
  "2022-2-48": {
    choices: { C: "데이터베이스에 대한 데이터인 메타데이터(Metadata)를 저장하고 있다." },
  },
  "2022-2-57": {
    isCode: false,
    isSql: true,
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2022-2-60": {
    isSql: true,
    hasImageReference: false,
    needsReview: false,
    reviewReasons: [],
    removeAssets: true,
  },
  "2022-2-61": {
    choices: { D: "strrev(s) - s를 거꾸로 변환한다." },
  },
  "2022-2-62": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

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
  "2022-2-63": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

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
  "2022-2-64": {
    choices: { B: "Packet Length는 IP 헤더를 제외한 패킷 전체의 길이를 나타내며 최대 크기는 2^32 - 1비트이다." },
  },
  "2022-2-65": {
    questionText: "다음 Python 프로그램의 실행 결과가 [실행 결과]와 같을 때, 빈칸에 적합한 것은?\n\nx = 20\nif x == 10:\n    print('10')\n( ) x == 20:\n    print('20')\nelse:\n    print('other')\n\n[실행 결과]\n20",
    isCode: true,
    hasImageReference: false,
    removeAssets: true,
  },
  "2022-2-67": {
    questionText: "다음에서 설명하는 프로세스 스케줄링은?\n\n최소 작업 우선(SJF) 기법의 약점을 보완한 비선점 스케줄링 기법으로 다음 식을 이용해 우선순위를 판별한다.\n\n우선순위 = (대기 시간 + 서비스 시간) / 서비스 시간",
  },
  "2022-2-71": {
    questionText: `다음 JAVA 프로그램이 실행되었을 때, 실행 결과는?

public class Rarr {
    static int[] marr() {
        int temp[] = new int[4];
        for (int i = 0; i < temp.length; i++)
            temp[i] = i;
        return temp;
    }

    public static void main(String[] args) {
        int iarr[];
        iarr = marr();
        for (int i = 0; i < iarr.length; i++)
            System.out.print(iarr[i] + " ");
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-2-72": {
    questionText: `다음 JAVA 프로그램이 실행되었을 때의 결과는?

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
  "2022-2-74": {
    questionText: `다음 C언어 프로그램이 실행되었을 때, 실행 결과는?

#include <stdio.h>

int main(int arge, char* argv[]) {
    int n1 = 1, n2 = 2, n3 = 3;
    int r1, r2, r3;
    r1 = (n2 <= 2) || (n3 > 3);
    r2 = !n3;
    r3 = (n1 > 1) && (n2 < 3);
    printf("%d", r3 - r2 + r1);
    return 0;
}`,
    choices: { A: "0", B: "1", C: "2", D: "3" },
    isCode: true,
    removeAssets: true,
  },
  "2022-2-79": {
    questionText: `a[0]의 주소값이 10일 경우 다음 C언어 프로그램이 실행되었을 때의 결과는? (단, int형의 크기는 4Byte로 가정한다.)

#include <stdio.h>

int main(int argc, char* argv[]) {
    int a[] = { 14, 22, 30, 38 };
    printf("%u, ", &a[2]);
    printf("%u", a);
    return 0;
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-2-81": {
    questionText: "소프트웨어 개발에서 정보보안 3요소에 해당하지 않는 설명은?",
    choices: {
      C: "가용성: 인가된 사용자는 가지고 있는 권한 범위 내에서 언제든 자원 접근이 가능하다.",
      D: "휘발성: 인가된 사용자가 수행한 데이터는 처리 완료 즉시 폐기되어야 한다.",
    },
  },
  "2022-2-84": { isCode: false },
  "2022-2-85": {
    choices: {
      A: "반제품 상태의 제품을 토대로 도메인별로 필요한 서비스 컴포넌트를 사용하여 재사용성 확대와 성능을 보장받을 수 있게 하는 개발 소프트웨어이다.",
      C: "설계 관점에 개발 방식을 패턴화시키기 위한 노력의 결과물인 소프트웨어 디자인 패턴을 반제품 소프트웨어 상태로 집적화시킨 것으로 볼 수 있다.",
      D: "프레임워크의 동작 원리를 그 제어 흐름의 일반적인 프로그램 흐름과 반대로 동작한다고 해서 IoC(Inversion of Control)이라고 설명하기도 한다.",
    },
    isCode: false,
  },
  "2022-2-86": {
    choices: { B: "국내에서는 공인인증제의 폐지와 전자서명법 개정을 추진하면서 클라우드 HSM 용어가 자주 등장하였다." },
  },
  "2022-2-87": {
    questionText: "다음 내용이 설명하는 기술로 가장 적절한 것은?\n\n• 다른 국을 향하는 호출이 중계에 의하지 않고 직접 접속되는 그물 모양의 네트워크이다.\n• 통신량이 많은 비교적 소수의 국 사이에 구성될 경우 경제적이며 간편하지만, 다수의 국 사이에는 회선이 세분화되어 비경제적일 수도 있다.\n• 해당 형태의 무선 네트워크의 경우 대용량을 빠르고 안전하게 전달할 수 있어 행사장이나 군 등에서 많이 활용된다.",
  },
  "2022-2-89": {
    questionText: "악성코드의 유형 중 다른 컴퓨터의 취약점을 이용하여 스스로 전파하거나 메일로 전파되며 스스로를 증식하는 것은?",
    isCode: false,
  },
  "2022-2-94": { isCode: false },
  "2022-2-93": {
    choices: {
      A: "대칭 암호 알고리즘은 비교적 실행 속도가 빠르기 때문에 다양한 암호의 핵심 함수로 사용될 수 있다.",
      C: "비대칭 암호 알고리즘은 자신만이 보관하는 비밀키를 이용하여 인증, 전자서명 등에 적용이 가능하다.",
    },
  },
  "2022-2-96": {
    choices: {
      A: "프로젝트를 완성하는 데 필요한 man-month로 산정 결과를 나타낼 수 있다.",
      D: "프로젝트 개발 유형에 따라 object, dynamic, function의 3가지 모드로 구분한다.",
    },
    isCode: false,
  },
  "2022-2-97": {
    choices: {
      B: "소유: 주체는 ‘그가 가지고 있는 것’을 보여주며 예시로는 토큰, 스마트카드 등이 있다.",
      D: "행위: 주체는 ‘그가 하는 것’을 보여주며 예시로는 서명, 움직임, 음성 등이 있다.",
    },
  },
  "2022-2-98": {
    questionText: "시스템의 사용자가 로그인하여 명령을 내리는 과정에 대한 시스템의 동작 중 다음 설명에 해당하는 것은?\n\n• 자신의 신원(Identity)을 시스템에 증명하는 과정이다.\n• 아이디와 패스워드를 입력하는 과정이 가장 일반적인 예시라고 볼 수 있다.",
  },
  "2022-2-99": {
    questionText: "다음에서 설명하는 IT 기술은?\n\n• 네트워크를 제어부와 데이터 전달부로 분리하여 네트워크 관리자가 보다 효율적으로 네트워크를 제어·관리할 수 있는 기술\n• 기존의 라우터, 스위치 등과 같이 하드웨어에 의존하는 네트워크 체계에서 안정성, 속도, 보안 등을 소프트웨어로 제어·관리하기 위해 개발됨\n• 네트워크 장비의 펌웨어 업그레이드를 통해 사용자의 직접적인 데이터 전송 경로 관리가 가능하고, 기존 네트워크에는 영향을 주지 않으면서 특정 서비스의 전송 경로 수정을 통하여 인터넷상에서 발생하는 문제를 처리할 수 있음",
  },

  "2022-3-1": {
    choices: {
      A: "사용 사례를 확장하여 명세하거나 설계 다이어그램, 원시 코드, 테스트 케이스 등에 적용할 수 있다.",
      D: "단순한 테스트 케이스를 이용하여 프로덕트를 수작업으로 수행해 보는 것이다.",
    },
    isCode: false,
  },
  "2022-3-3": {
    questionText: "익스트림 프로그래밍(eXtreme Programming)의 5가지 가치에 속하지 않는 것은?",
  },
  "2022-3-13": {
    questionText: "다음 내용이 설명하는 디자인 패턴은?\n\n• 하나의 객체를 생성하면 생성된 객체를 어디서든 참조할 수 있지만, 여러 프로세스가 동시에 참조할 수는 없다.\n• 클래스 내에서 인스턴스가 하나뿐임을 보장하며, 불필요한 메모리 낭비를 최소화할 수 있다.",
  },
  "2022-3-17": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-3-21": {
    choices: {
      A: "화이트박스 테스트는 모듈의 논리적인 구조를 체계적으로 점검할 수 있다.",
      D: "화이트박스 테스트에서 기본 경로(Basis Path)란 흐름 그래프의 시작 노드에서 종료 노드까지의 서로 독립된 경로로 사이클을 허용하지 않는 경로를 말한다.",
    },
  },
  "2022-3-23": {
    choices: { C: "형상관리를 위하여 구성된 팀을 ‘chief programmer team’이라고 한다." },
  },
  "2022-3-24": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-3-28": {
    choices: { A: "암호화 수행 시 일방향 암호화만 지원한다." },
  },
  "2022-3-30": {
    questionText: "다음 자료에 대하여 선택(Selection) 정렬을 이용하여 오름차순으로 정렬하고자 한다. 1회전 수행 결과는?\n\n8, 3, 4, 9, 7",
    hasImageReference: false,
    removeAssets: true,
  },
  "2022-3-34": { isCode: false },
  "2022-3-35": {
    choices: { C: "Valgrind" },
    isCode: false,
    needsReview: true,
    reviewReasons: ["원본 PDF에는 'valance'로 인쇄되어 있으나 정적 분석 도구가 아닌 동적 분석 도구를 묻는 문맥에 맞춰 Valgrind로 정규화"],
  },
  "2022-3-38": {
    choices: {
      B: "신규 및 변경 개발 소스를 식별하고, 이를 모듈화하여 상용 제품으로 패키징한다.",
      C: "고객의 편의성을 위해 매뉴얼 및 버전 관리를 지속적으로 한다.",
      D: "범용 환경에서 사용이 가능하도록 일반적인 배포 형태로 패키징이 진행된다.",
    },
  },
  "2022-3-41": {
    choices: { D: "사용자 정의 무결성 규정은 주어진 튜플의 값이 그 튜플이 정의된 도메인에 속한 값이어야 한다는 것을 규정하는 것이다." },
  },
  "2022-3-42": {
    hasImageReference: true,
    needsReview: false,
    reviewReasons: [],
  },
  "2022-3-43": {
    choices: { B: "트랜잭션의 수행과 관계없이 데이터베이스가 가지고 있는 고정 요소는 일관되어야 한다." },
  },
  "2022-3-47": {
    questionText: "다음 SQL문의 실행 결과를 가장 올바르게 설명한 것은?\n\nALTER TABLE 학생 DROP 학년 CASCADE;",
  },
  "2022-3-49": {
    choices: {
      A: "정규형에는 제1정규형, 제2정규형, 제3정규형, BCNF형, 제4정규형 등이 있다.",
      B: "릴레이션에 속한 모든 도메인이 원자값만으로 되어 있는 정규형은 제1정규형이다.",
    },
  },
  "2022-3-55": {
    choices: { A: "여러 사용자가 데이터베이스에 동시에 접근하여 데이터를 처리하기 위함이다." },
  },
  "2022-3-57": {
    choices: {
      B: "이벤트가 발생할 때마다 관련 작업이 자동으로 수행되는 절차형 SQL이다.",
      D: "DBMS에 내장되어 작성된 SQL이 효율적으로 수행되도록 최적의 경로를 찾아 주는 모듈이다.",
    },
  },
  "2022-3-58": {
    questionText: "관계 대수와 관계 해석에 대한 설명으로 옳지 않은 것은?",
    choices: { D: "관계 해석은 원하는 정보가 무엇이라는 것만 정의하는 비절차적인 특징을 가지고 있다." },
  },
  "2022-3-59": {
    questionText: "정보시스템과 관련한 다음 설명에 해당하는 것은?\n\n• 각 시스템 간에 공유 디스크를 중심으로 클러스터링으로 엮어 다수의 시스템을 동시에 연결할 수 있다.\n• 조직, 기업의 기간 업무 서버 안정성을 높이기 위해 사용될 수 있다.\n• 여러 가지 방식으로 구현되며 2개의 서버를 연결하는 것으로 2개의 시스템이 각각 업무를 수행하도록 구현하는 방식이 널리 사용된다.",
  },
  "2022-3-62": {
    questionText: `다음 C언어 프로그램의 결과로 옳은 것은?

#include <stdio.h>

main() {
    int a = 3, b = 4, c = 5;
    int r1, r2, r3;
    r1 = a < 4 && b <= 4;
    r2 = a > 3 || b <= 5;
    r3 = !c;
    printf("%d", r1 - r2 + r3);
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-3-63": {
    questionText: `다음 C언어 프로그램 실행 후, 'c'를 입력하였을 때 출력 결과는?

#include <stdio.h>

main() {
    char ch;
    scanf("%c", &ch);
    switch (ch) {
        case 'a':
            printf("one ");
        case 'b':
            printf("two ");
        case 'c':
            printf("three ");
            break;
        case 'd':
            printf("four ");
            break;
    }
}`,
    isCode: true,
    removeAssets: true,
  },
  "2022-3-64": {
    questionText: `다음 C언어 프로그램에서 밑줄 친 부분(!a && !b)과 동일한 의미를 가지는 것은 무엇인가?

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
    removeAssets: true,
  },
  "2022-3-66": {
    choices: { D: "SJF 기법을 보완하기 위한 스케줄링 방법이다." },
  },
  "2022-3-68": {
    choices: { C: "프로세스는 스레드 내의 작업 단위를 의미하며, 경량 스레드라고도 불린다." },
  },
  "2022-3-69": {
    questionText: "3개의 보관 구조를 가지는 주기억장치가 있으며, 다음 순서로 페이지 참조가 발생할 때 FIFO 페이지 교체 알고리즘을 사용할 경우 마지막 페이지 값으로 옳은 것은?\n\n페이지 순서: 1, 2, 3, 2, 4, 2, 3, 1, 3",
  },
  "2022-3-70": {
    choices: { B: "스래싱(Thrashing)" },
  },
  "2022-3-77": {
    questionText: "TCP/IP에서 사용되는 논리 주소를 물리 주소로 변환시켜 주는 프로토콜은?",
  },
  "2022-3-79": {
    choices: { A: "소프트웨어 구성에 필요한 기본 구조를 제공함으로써 재사용이 가능하게 해 준다." },
  },
  "2022-3-80": {
    choices: { A: "문자열을 수치 데이터로 바꾸는 문자 변환 함수와 수치를 문자열로 바꿔 주는 변환 함수 등이 있다." },
  },
  "2022-3-81": {
    choices: {
      C: "자원 삽입: 악의적인 명령어가 포함된 스크립트 파일을 업로드함으로써 시스템에 손상을 준다.",
      D: "운영체제 명령어 삽입: 외부 입력값을 통해 시스템 명령어의 실행을 유도함으로써 권한을 탈취하거나 시스템 장애를 유발한다.",
    },
    isCode: false,
    isSql: false,
  },
  "2022-3-82": {
    questionText: "악성코드의 유형 중 다른 컴퓨터의 취약점을 이용하여 스스로 전파하거나 메일로 전파되며 스스로를 증식하는 것은?",
    isCode: false,
  },
  "2022-3-83": {
    choices: {
      A: "시스템 내의 정보와 자원은 인가된 사용자에게만 접근이 허용된다는 것을 의미한다.",
      B: "시스템 내의 정보와 자원을 사용하려는 사용자가 합법적인 사용자인지를 확인하는 모든 행위를 말한다.",
    },
  },
  "2022-3-90": {
    choices: {
      B: "HIDS(Host-Based Intrusion Detection)는 운영체제에 설정된 사용자 계정에 따라 어떤 사용자가 어떤 접근을 시도하고 어떤 작업을 했는지에 대한 기록을 남기고 추적한다.",
      C: "NIDS(Network-Based Intrusion Detection System)로는 대표적으로 Snort가 있다.",
    },
  },
  "2022-3-92": { isSql: false },
  "2022-3-94": {
    questionText: "다음 내용이 설명하는 것은?\n\n• 블록체인(Blockchain) 개발 환경을 클라우드로 서비스하는 개념\n• 블록체인 네트워크에 노드의 추가 및 제거가 용이\n• 블록체인의 기본 인프라를 추상화하여 블록체인 응용 프로그램을 만들 수 있는 클라우드 컴퓨팅 플랫폼",
  },
  "2022-3-95": {
    questionText: "소프트웨어 재공학의 주요 활동 중 기존 소프트웨어를 다른 운영체제나 하드웨어 환경에서 사용할 수 있도록 변환하는 것은?",
  },
  "2022-3-97": {
    questionText: "다음 내용이 설명하는 것은?\n\n• 네트워크상에 광채널 스위치의 이점인 고속 전송과 장거리 연결 및 멀티 프로토콜 기능을 활용\n• 각기 다른 운영체제를 가진 여러 기종들이 네트워크상에서 동일 저장장치의 데이터를 공유하게 함으로써, 여러 개의 저장장치나 백업 장비를 단일화시킨 시스템",
  },
  "2022-3-100": {
    choices: { B: "국내에서는 공인인증제의 폐지와 전자서명법 개정을 추진하면서 클라우드 HSM 용어가 자주 등장하였다." },
  },
} as const satisfies Record<string, ExamCorrection2022>;

/**
 * 좌표는 extract-exams.ts가 생성하는 1.5배 렌더(893×1262)를 기준으로 한다.
 * 전체 페이지 대신 문항에 필요한 도형만 잘라 표시한다.
 */
export const crops2022 = {
  "2022-1-44": {
    sourceAsset: "data/imported/2022/1/assets/page-3.png",
    outputAsset: "data/imported/2022/1/assets/question-44-multivalue.png",
    pageNumber: 3,
    type: "choice_diagram",
    altText: "E-R 모델의 다중값 속성 표기 선택지 도형",
    x: 475,
    y: 960,
    width: 350,
    height: 65,
  },
  "2022-2-33": {
    sourceAsset: "data/imported/2022/2/assets/page-3.png",
    outputAsset: "data/imported/2022/2/assets/question-33-inspection-flow.png",
    pageNumber: 3,
    type: "diagram",
    altText: "인스펙션 과정의 계획과 (가)~(마) 흐름도",
    x: 475,
    y: 435,
    width: 370,
    height: 95,
  },
  "2022-2-37": {
    sourceAsset: "data/imported/2022/2/assets/page-4.png",
    outputAsset: "data/imported/2022/2/assets/question-37-tree.png",
    pageNumber: 4,
    type: "diagram",
    altText: "후위 순회 대상 트리",
    x: 80,
    y: 120,
    width: 310,
    height: 142,
  },
  "2022-3-17": {
    sourceAsset: "data/imported/2022/3/assets/page-2.png",
    outputAsset: "data/imported/2022/3/assets/question-17-module-structure.png",
    pageNumber: 2,
    type: "diagram",
    altText: "모듈 F의 fan-in과 fan-out을 구하기 위한 프로그램 구조도",
    x: 90,
    y: 485,
    width: 230,
    height: 135,
  },
  "2022-3-24": {
    sourceAsset: "data/imported/2022/3/assets/page-2.png",
    outputAsset: "data/imported/2022/3/assets/question-24-tree.png",
    pageNumber: 2,
    type: "diagram",
    altText: "후위 순회 대상 트리",
    x: 485,
    y: 488,
    width: 165,
    height: 100,
  },
  "2022-3-42": {
    sourceAsset: "data/imported/2022/3/assets/page-3.png",
    outputAsset: "data/imported/2022/3/assets/question-42-transaction-state.png",
    pageNumber: 3,
    type: "diagram",
    altText: "활동, 부분 완료, 실패, 완료, 철회로 이어지는 트랜잭션 상태도",
    x: 480,
    y: 605,
    width: 190,
    height: 175,
  },
} as const satisfies Record<string, ExamCrop2022>;
