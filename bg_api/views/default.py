# -*- coding:utf-8 -*-
"""系统功能视图"""
import flask

from flask import Blueprint, g, request, current_app, jsonify, redirect, url_for

from sharper.flaskapp.helper import json_error, json_ok, render_json_warn, render_json_error
from sharper.lib.error import AuthFailedError, AppError
from sharper.lib.validator import is_mobile
from sharper.util.helper import get_int
from bg_biz.service.user_service import send_user_vcode
from bg_biz.orm.user import UserVcode, User
import os
from flask.helpers import send_from_directory
from flask_login.utils import logout_user

DefaultView = Blueprint('default', __name__)


def error_handler(e):
	"""
	debug关闭后统一错误处理
	"""
	if isinstance(e, AuthFailedError):
		return json_error(e, 401)
	elif isinstance(e, AppError):
		return render_json_warn(e, request)
	else:
		return render_json_error(e, request)


@DefaultView.route('/', methods=['GET'])
def default():
	g.ret_success_func = json_ok
	return g.ret_success_func(flask='flask ' + flask.__version__)

@DefaultView.route('/favicon.ico', methods=['GET'])
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

@DefaultView.route('/profile', methods=['GET'])
def profile():
	ret = dict()
	ret['host'] = current_app.config.get("HTTP_DOMAIN");
	ret['port'] = current_app.config.get("PORT");
	return g.ret_success_func(profile=ret)

@DefaultView.route('/logout', methods=['GET', 'POST'])
def logout():
	logout_user()
	return g.ret_success_func()

@DefaultView.route('/vcode')
def send_register_vcode():
    data = request.form or request.args
    phonenum = data.get("phone")
#     image_code = data.get("image_code")
#     print 'image_code:', image_code
    category = get_int(request.args.get('type', UserVcode.Category.REGISTER))
    if not phonenum:
        return jsonify(success=False, message=u'未指定验证手机号码')
    if not is_mobile(phonenum):
        return jsonify(success=False, message=u"请输入正确的手机号码")
#     check_result = check_validate(image_code)
#     print 'check_result', check_result
#     if not check_result:
#         return jsonify(success=False, message=u'图片验证码错误')
    user = User.get_by_phone(phonenum)
    # user = User.query.filter_by(phone=phonenum).first()
    # print user
    if category == UserVcode.Category.REGISTER:
        if user:
            return jsonify(success=False, message=u"该手机号码已经被注册",msgcode=1)
    else:
        if not user:
            return jsonify(success=False, message=u"该手机号码未注册，请确认",msgcode=1)
    try:
        code = send_user_vcode(phonenum, category, 'api')
        return jsonify(success=True, code=code if code else "")
    except AppError as e:
        return jsonify(success=False, message=e.msg)