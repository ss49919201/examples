MYSQL_VERSION?=8.0

.PHONY: dc-up
dc-up:
	VERSION=${MYSQL_VERSION} docker compose up -d

.PHONY: dc-down
dc-down:
	VERSION=${MYSQL_VERSION} docker compose down

.PHONY: dc-clean
dc-clean:dc-down
	VERSION=${MYSQL_VERSION} docker volume rm mysql_db-data

.PHONY: exec
exec:dc-up
	docker exec -it rdb /bin/bash

.PHONY: exec-mysql
exec-mysql:dc-up
	docker exec -it rdb /bin/bash -c "mysql -u root -ppassword rdb"

.PHONY: find-general-log-path
find-general-log-path:dc-up
	docker exec -i rdb sh /opt/mysql/find_general_log_path.sh

.PHONEY: init-db
init-db:dc-up
	docker exec -i rdb sh /opt/mysql/setup.sh
