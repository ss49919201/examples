select users.name, count(users.id) counted_id from users where email like concat('%', ?, '%') GROUP BY name;
