# -*- coding:utf-8 -*-
from datetime import datetime
from uuid import uuid4

from sharper.flaskapp.orm.base import BaseModel
from sharper.flaskapp.orm.display_enum import DisplayEnum
from sharper.flaskapp.orm.kvdb_mixin import KvdbMixin
from sharper.flaskapp.login import login_manager
from sharper.lib.error import ParaValidateFailError
from sharper.util.string import md5

from sqlalchemy import Column, INTEGER, VARCHAR, Integer, DATE, DATETIME

from flask_login import UserMixin



__author__ = [
    'sluggard'
]



class User(BaseModel, KvdbMixin, UserMixin):
    __tablename__ = 'user'

    __table_args__ = {}

    # __bind_key__ = 'beijing'

    class Gender(DisplayEnum):
        MALE = 1
        FEMALE = 0

        __display_cn__ = {
            MALE: u'男',
            FEMALE: u'女'
        }

    class Status(DisplayEnum):
        AVAILABLE = 1
        DISABLE = 0

        __display_cn__ = {
            AVAILABLE: u'有效',
            DISABLE: u'无效'
        }


    # column definitions
    id = Column(u'id', INTEGER(), primary_key=True, nullable=False, autoincrement=False)
    phone = Column(u'phone', VARCHAR(length=32), default=None)
    passwd = Column(u'passwd', VARCHAR(length=64), nullable=False)
    ucode = Column(u'ucode', VARCHAR(length=32), nullable=False)
    realname = Column(u'realname', VARCHAR(length=32), nullable=True)
    nick = Column(u'nick', VARCHAR(length=32), nullable=True)
    status = Column(u'status', Integer(), default=1)
    score = Column(u'score', Integer(), default=0)
    birthday = Column(u'birthday', DATE(), default=None)
    balance = Column(u'balance', Integer(), default=0)
    create_time = Column(u'create_time', DATETIME(), nullable=False, default=None)
    modify_time = Column(u'modify_time', DATETIME(), nullable=False, default=None)

    @login_manager.user_loader
    def load_user(self, userid):
        return User.get(userid)

    @classmethod
    def get(cls, id):
        if id <= 0:
            return None
        return User.get_by_kvdb(id)

    @classmethod
    def register(cls, phone, password, nickname=""):
        u = User()
        u.ucode = u.gen_usercode()
        u.phone = phone
        u.nickname = nickname

        u.set_password(password)

        u.insert()
        return u

    @classmethod
    def login(cls, phone, passwd):
        user = cls.get_by_phone(phone)
        print user
        if not user:
            raise AppError(msg=u"手机号码未注册，请确认")

        if not user.check_password(passwd):
            user.clear_unique_kvdb("phone", phone)
            raise AppError(msg=u"手机号码或者密码错误，请确认")

        # user.last_login_time = datetime.now()

        # user.update()

        return user

    @classmethod
    def get_by_phone(self, phone):
        return self.get_by_kvdb_unique('phone',phone);

    def gen_usercode(self):
        self.ucode = str(uuid4()).replace('-', '')
        return self.ucode

    def set_password(self, pwd):
        pwd = (pwd or '').strip()
        if not pwd:
            raise ParaValidateFailError(u'请输入密码。')
        if not self.ucode:
            raise RuntimeError(u'设置密码前必须确保用户有usercode！')
        self.passwd = md5(pwd + self.ucode)

    def check_password(self, pwd):
        print pwd
        print md5(pwd + self.ucode)
        print self.ucode
        print self.passwd
        return md5(pwd + self.ucode) == self.passwd



class UserVcode(BaseModel):
	__tablename__ = 'user_vcode'

	__table_args__ = {}

	class Status(DisplayEnum):
		INIT = 0
		VERIFIED = 1
		__display_cn__ = {
			INIT: u'未验证',
			VERIFIED: u'已验证'
		}

	class Category(DisplayEnum):
		REGISTER = 1
		FORGET_PASS = 2
		LOGIN = 3

		__display_cn__ = {
			REGISTER: u'注册',
			FORGET_PASS: u'忘记密码',
			LOGIN: u'登录',
		}

	class App(DisplayEnum):
		PORTAL = 'portal'
		ANDROID = 'Android'
		IOS = 'iOS'

		__display_cn__ = {
			PORTAL: u'portal',
			ANDROID: u'Android',
			IOS: u'iOS'
		}

	# column definitions

	id = Column(u'id', INTEGER(), primary_key=True, nullable=False, autoincrement=True)
	phone = Column(u'phone', VARCHAR(length=32), default=None)
	vcode = Column(u'vcode', VARCHAR(length=32), default=None)
	mac = Column(u'mac', VARCHAR(length=32), default=None)
	status = Column(u'status', Integer(), default=Status.INIT)
	app = Column(u'app', VARCHAR(length=32), default=None)
	category = Column(u'category', Integer(), default=Category.REGISTER)
	times = Column(u'times', Integer(), default=1)
	verifytime = Column(u'verifytime', DATETIME(), nullable=True)
	createtime = Column(u'createtime', DATETIME(), nullable=False, default=datetime.now)
	modifytime = Column(u'modifytime', DATETIME(), nullable=False, default=datetime.now)

	@property
	def status_cn(self):
		return self.Status.get_display_cn(self.status)

	@property
	def category_cn(self):
		return self.Category.get_display_cn(self.category)