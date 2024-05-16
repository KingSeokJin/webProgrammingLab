#202111256 김석진
import random

def estimate_pi(n):
    count = 0
    for i in range(n):
        # x, y는 [0~1)
        x = random.random()
        y = random.random()
        if (x-0.5)**2 + (y - 0.5)**2 <= 0.25:
            count += 1
    result = 4 * (count / n)
    return result

# n의 값에 대한 추정치를 저장할 리스트
n_list = [10, 100, 1000, 10000, 100000, 1000000]
pi_list = []

# 각 n값에 대해 pi 추정치 계산
for n in n_list:
    value = estimate_pi(n)
    pi_list.append(value)
    print(f"n={n}, 추정 pi 값: {value}")

