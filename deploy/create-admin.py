#!/usr/bin/env python3
"""Run on your server, from this directory, after starting PostgreSQL."""
import os, subprocess, getpass, pathlib
os.chdir(pathlib.Path(__file__).resolve().parent)
env=os.environ.copy()
env['WANEES_ADMIN_EMAIL']=input('Administrator email: ').strip()
env['WANEES_ADMIN_PASSWORD']=getpass.getpass('New password (12+ characters, mixed case, number and symbol): ')
if env['WANEES_ADMIN_PASSWORD']!=getpass.getpass('Confirm password: '):raise SystemExit('Passwords do not match.')
raise SystemExit(subprocess.call(['docker','compose','run','--rm','-e','WANEES_ADMIN_EMAIL','-e','WANEES_ADMIN_PASSWORD','api','--create-admin'],env=env))
