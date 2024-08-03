#!bin/bash

MYSQL_PWD=password
DATABASE=rdb
DIR=`dirname $0`

export MYSQL_PWD

# TODO: Database作成
echo Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${DATABASE};"

DDL=`find ${DIR}/sql -name "*.ddl"`
for D in ${DDL}
do
    TABLE=`basename ${D} .ddl`
    echo Create table: ${TABLE}
    mysql -u root ${DATABASE} < ${D}
done

# ダミーデータ作成
DML=`find ${DIR}/sql -name "*.dml"`
for D in ${DML}
do
    echo Insert dml file: `basename ${D}`
    mysql -u root ${DATABASE} < ${D}
done
