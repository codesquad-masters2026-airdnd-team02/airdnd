-- mysqld_exporter 전용 read-only 모니터 유저
-- 적용: app 박스에서 RDS 마스터(admin)로 접속해 실행
--   mysql -h <RDS> -u admin -p < rds-monitor-user.sql
-- (비밀번호는 실행 전 아래 'REPLACE_WITH_MONITOR_PASSWORD' 교체)

CREATE USER IF NOT EXISTS 'exporter'@'%' IDENTIFIED BY 'REPLACE_WITH_MONITOR_PASSWORD'
  WITH MAX_USER_CONNECTIONS 3;

-- mysqld_exporter 가 필요로 하는 최소 권한
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
FLUSH PRIVILEGES;
