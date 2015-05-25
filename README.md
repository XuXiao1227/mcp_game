初始化管理员用户

insert into customer(username, password, type, reg_time) values('admin', 'admin', 2, now());

游客
insert into customer(username, password, type, reg_time) values('guest', 'guest', 0, now());

普通用户
insert into customer(username, password, type, reg_time) values('test', 'test', 1, now());


BT01-投注
请求
{"ticket":{"game_code":"G01","multiple":1,"amount":20,"number":"1,2"},"uuid":"d76f88e9ca4a403b8f2ec6644b34f9ff"}
返回
{"ticket":{"game_code":"G01","multiple":1,"amount":20,"number":"1,2","draw_number":[1,2,4,3],"draw_info":[{"level":4,"count":2}],"hit_amount":10},"uuid":"d76f88e9ca4a403b8f2ec6644b34f9ff","code":0,"description":"系统处理成功"}