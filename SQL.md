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

## 데이터 가져오기
### 구문1
```sql
-- 가져오기
SELECT 컬럼명, 컬럼명 ... FROM gbook
SELECT * FROM gbook

-- 데이터를 정렬해서 가져오기
-- 오름차순
SELECT * FROM gbook ORDER BY id ASC
-- 내림차순
SELECT * FROM gbook ORDER BY id DESC

-- 원하는 데이터만 가져오기
SELECT * FROM gbook WHERE id=5
SELECT * FROM gbook WHERE wtime > '2019-09-01 00:00:00' ORDER BY wtime DESC 
SELECT * FROM gbook WHERE comment = '하이'
SELECT * FROM gbook WHERE comment LIKE '%하이%' ORDER BY id DESC

-- 원하는 갯수만 가져오기
SELECT * FROM gbook WHERE comment LIKE '%기자%' ORDER BY id DESC LIMIT 0, 5
SELECT * FROM gbook WHERE comment LIKE '%기자%' ORDER BY id DESC LIMIT 10, 5

-- 레코드의 갯수를 가져오기
SELECT count(id) FROM gbook
```

## 데이터 삭제
```sql
-- 삭제 SQL - WHERE절이 없으면 모든 데이터가 삭제되므로 박스 구해야 함.
DELETE FROM 테이블명 WHERE 조건

DELETE FROM gbook WHERE id=5
```

## 데이터 수정
