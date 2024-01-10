import json
import matplotlib.pyplot as plt
import glob
import numpy as np

file_pattern = "memoryUsageResults_*"
file_list = glob.glob(file_pattern)

all_data = []

for file_name in file_list:
    with open(file_name, 'r') as file:
        data = json.load(file)
        # null を0で置換
        data['arrowFunctionResults'] = [0 if v is None else v for v in data['arrowFunctionResults']]
        data['regularFunctionResults'] = [0 if v is None else v for v in data['regularFunctionResults']]
        all_data.append(data)


plt.figure(figsize=(10, 6))

for i, data in enumerate(all_data):
    # インデックスリスト生成
    index = np.arange(len(data['arrowFunctionResults']))
    plt.plot(index, data['arrowFunctionResults'], label=f'File {i+1} - Property 1', marker='o')
    plt.plot(index, data['regularFunctionResults'], label=f'File {i+1} - Property 2', marker='x')

plt.title('Comparing the memory usage of arrow function and regular function')
plt.xlabel('Usage')
plt.ylabel('Count')

plt.grid(True)

plt.legend()
plt.show()
