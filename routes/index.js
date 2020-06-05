const express = require('express');
const router = express.Router();
const conn = require('./../db/db');

const svgCaptcha = require('svg-captcha');

const sms_util = require('./../util/sms_util');

const md5 = require('blueimp-md5');

let users = {}; //用户信息

//在数据库中创建对象
/* const recommendArr = require('./../data/recommend').data;

router.get('/recommend/api', function (req, res, next) {
    let tempArr_all = [];
    for (let i = 0; i < recommendArr.length; i++) {
        let oldItem = recommendArr[i];
        let tempArr = [];
        tempArr.push(oldItem.goods_id);
        tempArr.push(oldItem.goods_name);
        tempArr.push(oldItem.short_name);
        tempArr.push(oldItem.thumb_url);
        tempArr.push(oldItem.hd_thumb_url);
        tempArr.push(oldItem.image_url);
        tempArr.push(oldItem.price);
        tempArr.push(oldItem.normal_price);
        tempArr.push(oldItem.market_price);
				tempArr.push(oldItem.sales_tip);
				
        tempArr_all.push(tempArr);
    }

    //2. 遍历数据, 插入数据库
    let sql = "INSERT INTO recommend(`goods_id`,`goods_name`,`short_name`, `thumb_url`, `hd_thumb_url`,`image_url`, `price`, `normal_price`,`market_price`,`sales_tip` ) VALUES ?";

    conn.query(sql, [tempArr_all], function (err, rows, fields) {
        if (err) {
            console.log('INSERT ERROR - ', err.message);
            return;
        }
        console.log("INSERT SUCCESS");
    });
})*/

/**
 * 获取首页轮播图
 */
router.get('/api/homecasual', (req, res) => {
	// 数据库查询
	let sqlStr = 'select * from pdd_homecasual';
	conn.query(sqlStr, (err, results) => {
		if (err)
			return res.json({ err_code: 1, message: '资料不存在', affextedRows: 0 });
		res.json({
			success_code: 200,
			message: results,
			affextedRows: results.affextedRows,
		});
	});

	//从本地获取数据
	// const data = require('../data/homecasual');
	// res.json({
	//   success_code: 200,
	//   message: data,
	// });
});

/**
 * 获取首页导航
 */
router.get('/api/homenav', (req, res) => {
	/*
    let sqlStr = 'select * from homenav';
     conn.query(sqlStr, (err, results) => {
         if (err) return res.json({err_code: 1, message: '资料不存在', affextedRows: 0})
         res.json({success_code: 200, message: results, affextedRows: results.affextedRows})
     })
     */
	const data = require('../data/homenav');
	res.json({
		success_code: 200,
		message: data,
	});
});

/**
 * 获取首页商品列表
 */
router.get('/api/homeshoplist', (req, res) => {
	/*
   let sqlStr = 'select * from homeshoplist';
    conn.query(sqlStr, (err, results) => {
        if (err) return res.json({err_code: 1, message: '资料不存在', affextedRows: 0})
        res.json({success_code: 200, message: results, affextedRows: results.affextedRows})
    })
    */
	setTimeout(function () {
		const data = require('../data/shopList');
		res.json({
			success_code: 200,
			message: data,
		});
	}, 300);
});

/**
 * 获取推荐商品列表
 * 每次返回10条
 */
router.get('/api/recommendshoplist', (req, res) => {
	let pageNo = req.query.page || 1;
	let pageSize = req.query.count || 10;

	let sqlStr =
		'select * from pdd_recommend limit ' +
		(pageNo - 1) * pageSize +
		',' +
		pageSize;
	conn.query(sqlStr, (err, results) => {
		if (err)
			return res.json({
				err_code: 1,
				message: '资料不存在',
				affextedRows: 0,
			});
		setTimeout(function () {
			res.json({
				success_code: 200,
				message: results,
				affextedRows: results.affextedRows,
			});
		}, 1000);
	});
	// setTimeout(function () {
	//     const data = require('../data/recommend');
	//     res.json({
	//         success_code: 200,
	//         message: data
	//     })
	// }, 10);
});

/**
 * 获取推荐商品列表拼单用户
 */
router.get('/api/recommenduser', (req, res) => {
	setTimeout(function () {
		const data = require('../data/recommend_users');
		res.json({
			success_code: 200,
			message: data,
		});
	}, 10);
});

/**
 * 获取搜索分类列表
 */
router.get('/api/searchgoods', (req, res) => {
	setTimeout(function () {
		const data = require('../data/search');
		res.json({
			success_code: 200,
			message: data,
		});
	}, 10);
});

/**
 * 获取商品数据
 */
router.get('/api/getqalist', (req, res) => {
	const course = req.query.course;
	const limit = req.query.limit || 20;
	const keyword = req.query.keyword || '';

	let sqlStr = 'select * from qa where course= "' + course + '" LIMIT ' + limit;
	if (keyword !== '') {
		sqlStr =
			'select * from qa where course= "' +
			course +
			'" AND qname LIKE "%' +
			keyword +
			'%" LIMIT ' +
			limit;
	}

	conn.query(sqlStr, (err, results) => {
		if (err)
			return res.json({
				err_code: 1,
				message: '资料不存在',
				affextedRows: 0,
			});
		res.json({
			success_code: 200,
			message: results,
			affextedRows: results.affextedRows,
		});
	});
});

/**
 * 获取学生列表
 */
router.get('/api/getStuList', (req, res) => {
	let sqlStr = 'select * from student';
	conn.query(sqlStr, (err, results) => {
		if (err)
			return res.json({
				err_code: 1,
				message: '获取数据失败',
				affextedRows: 0,
			});
		res.json({
			success_code: 200,
			message: results,
			affextedRows: results.affextedRows,
		});
	});
});

/**
 * 往数据库中插入学生记录
 */
router.post('/api/insertStuList', function (req, res) {
	conn.query('INSERT INTO student SET  ?', req.body, (err, results) => {
		if (err)
			return res.json({
				err_code: 1,
				message: '插入数据失败',
				affextedRows: 0,
			});
		res.json({
			success_code: 200,
			message: '插入成功',
		});
	});
});

/**
 * 删除数据库中的一条学生记录
 */
router.post('/api/delStuList', (req, res) => {
	console.log(req.body);
	let sqlStr = 'DELETE FROM student WHERE id = ?';
	conn.query(sqlStr, [req.body.id], (err, results) => {
		if (err)
			return res.json({
				err_code: 1,
				message: '删除数据失败',
				affextedRows: 0,
			});
		res.json({
			success_code: 200,
			message: '删除数据成功',
			affextedRows: 0,
		});
	});
});

router.get('/public/images/home/*', function (req, res) {
	res.sendFile(req.url);
	console.log(req.url);
	console.log(__dirname);
});

/**
 * 获取一次性验证码
 */
router.get('/api/captcha', (req, res) => {
	// 或得验证码
	let captcha = svgCaptcha.create({
		color: true,
		noise: 3,
		ignoreChars: '0o1i',
		size: 4,
	});
	// 保存到session当中
	req.session.captcha = captcha.text.toLocaleLowerCase();
	// 返回给客户端
	res.type('svg');
	res.send(captcha.data);
});

/**
 * 发送验证码短信
 */
router.get('/api/send_code', (req, res) => {
	// 获取手机号
	let phone = req.query.phone;
	// 获取验证码
	let code = sms_util.randomCode(6);
	// 发送验证码
	// sms_util.sendCode(phone, code, function(success) {
	// if (success) {
	//   users[phone] = code;
	//   res.json({ success_code: 200, message: "验证码获取成功" });
	// } else {
	//   res.json({ err_code: 0, message: "验证码获失败" });
	// }
	// });

	// 成功
	setTimeout(() => {
		users[phone] = code;
		res.json({
			success_code: 200,
			message: code,
		});
	}, 2000);

	// 失败
	// setTimeout(() => {
	//   res.json({
	//     err_code: 0,
	//     message: "验证码获失败"
	//   });
	// }, 1000)
});

/**
 * 手机验证码登录
 */
router.post('/api/login_code', (req, res) => {
	// 1.拿到数据
	const phone = req.body.phone;
	const code = req.body.code;
	// 2.对比验证码
	if (code != users[phone]) {
		res.json({
			err_code: 0,
			message: '验证码不正确',
		});
		return;
	}
	// 3.根据手机号查询
	delete users[phone];

	let sqlStr =
		'SELECT * FROM myshopdb.pdd_user_info where user_phone = ' +
		phone +
		' limit 1;';
	conn.query(sqlStr, (err, results) => {
		if (err) {
			res.json({
				err_code: 0,
				message: '请求数据失败',
			});
		} else {
			results = JSON.parse(JSON.stringify(results));
			if (results[0]) {
				// 用户已存在
				req.session.userId = results[0].id;
				res.json({
					success_code: 200,
					message: {
						id: results[0].id,
						user_name: results[0].user_name,
						user_phone: results[0].user_phone,
					},
				});
			} else {
				// 新用户
				const addSql =
					'insert into myshopdb.pdd_user_info(user_name,user_phone) values (?,?)';
				const addSqlParams = [phone, phone];
				conn.query(addSql, addSqlParams, (err, results) => {
					results = JSON.parse(JSON.stringify(results));
					if (!err) {
						req.session.userId = results.insertId;
						let sqlStr =
							'SELECT * FROM myshopdb.pdd_user_info where id = ' +
							results.insertId +
							' limit 1;';
						conn.query(sqlStr, (err, results) => {
							if (err) {
								res.json({
									err_code: 0,
									message: '请求数据失败',
								});
							} else {
								results = JSON.parse(JSON.stringify(results));
								if (results[0]) {
									// 用户已存在
									req.session.userId = results[0].id;
									res.json({
										success_code: 200,
										message: {
											id: results[0].id,
											user_name: results[0].user_name,
											user_phone: results[0].user_phone,
										},
									});
								}
							}
						});
					}
				});
			}
		}
	});
});

/**
 * 用户名密码登录
 */
router.post('/api/login_pwd', (req, res) => {
	// 1.拿到数据
	const user_name = req.body.name;
	const user_pwd = md5(req.body.pwd);
	const captcha = req.body.captcha.toLowerCase();

	// 2.对比验证码
	if (captcha !== req.session.captcha) {
		res.json({
			err_code: 0,
			message: '图形验证码不正确！',
		});
		return;
	}

	delete req.session.captcha;

	// 3.查询数据
	let sqlStr =
		"SELECT * FROM myshopdb.users where user_name = '" +
		user_name +
		"' limit 1;";
	conn.query(sqlStr, (err, results) => {
		if (err) {
			res.json({
				err_code: 0,
				message: '用户名不正确！',
			});
		} else {
			results = JSON.parse(JSON.stringify(results));
			if (results[0]) {
				// 用户已存在
				// 验证密码是否正确
				if (results[0].user_pwd !== user_pwd) {
					res.json({
						err_code: 0,
						message: '密码不正确！',
					});
				} else {
					req.session.userId = results[0].id;
					res.json({
						success_code: 200,
						message: {
							id: results[0].id,
							user_name: results[0].user_name,
							user_phone: results[0].user_phone,
						},
						info: '登陆成功！',
					});
				}
			} else {
				// 新用户
				const addSql =
					'insert into myshopdb.users(user_name,user_pwd) values (?,?)';
				const addSqlParams = [user_name, user_pwd];
				conn.query(addSql, addSqlParams, (err, results) => {
					results = JSON.parse(JSON.stringify(results));
					if (!err) {
						req.session.userId = results.insertId;
						let sqlStr =
							'SELECT * FROM myshopdb.users where id = ' +
							results.insertId +
							' limit 1;';
						conn.query(sqlStr, (err, results) => {
							if (err) {
								res.json({
									err_code: 0,
									message: '请求数据失败',
								});
							} else {
								results = JSON.parse(JSON.stringify(results));
								if (results[0]) {
									// 用户已存在
									req.session.userId = results[0].id;
									res.json({
										success_code: 200,
										message: {
											id: results[0].id,
											user_name: results[0].user_name,
											user_phone: results[0].user_phone,
										},
									});
								}
							}
						});
					}
				});
			}
		}
	});
});

/**
 * 根据session中的用户ID过去用户信息
 */

router.get('/api/user_info', (req, res) => {
	// 获取参数
	let userId = req.session.userId;

	let sqlStr =
		'SELECT * FROM myshopdb.pdd_user_info where id = ' + userId + ' limit 1;';
	conn.query(sqlStr, (err, results) => {
		if (err) {
			res.json({ err_code: 0, message: '请求数据失败' });
		} else {
			results = JSON.parse(JSON.stringify(results));
			if (!results[0]) {
				// 用户不存在
				delete req.session.userId;
				res.json({ err_code: 1, message: '请先登录！' });
			} else {
				res.json({
					success_code: 200,
					message: {
						id: results[0].id,
						user_name: results[0].user_name,
						user_phone: results[0].user_phone,
					},
				});
			}
		}
	});
});

module.exports = router;
