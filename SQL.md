# SQL을 배워봅시다.

## 데이터 추가
### 구문1
```sql
INSERT INTO 테이블명 SET 컬럼명='값', 컬럼명='값';
# 예제
INSERT INTO gbook SET comment='안녕하세요', wtime='2019-09-03 13:26:22';
```
### 구문2
```sql
INSERT INTO 테이블명 (컬럼명, 컬럼명 ...) VALUES (값, 값 ...);
# 예제
INSERT INTO gbook ('comment', 'wtime') VALUES ('안녕하세요', '2019-09-03 13:26:22');
```

## 데이터 삭제

## 데이터 수정

## 데이터 가져오기