import pandas as pd

# Read the CSV files into pandas DataFrames
df1 = pd.read_csv('./csv/points_formatted.csv')
df2 = pd.read_csv('./csv/23_24_formatted.csv')
df3 = pd.read_csv('./csv/sem1_formatted.csv')

# Assuming the usernames are in a column named 'username'
# Find the usernames in document 1 that are not in document 2
missing_usernames = df1[~df1['username'].isin(df2['username'])]
print("Missing usernames in df2: ", missing_usernames)

# Merge df3 with df2 to get usernames based on names
merged = pd.merge(df3, df1[['name', 'username']], on='name', how='left')

still_missing = missing_usernames[~missing_usernames['name'].isin(merged['name'])]
print("Still missing: ", still_missing)

# print(merged[merged['name'] == "HERZ JOAQUIN JONAS"])

from_df3 = merged[merged['name'].isin(missing_usernames['name'])]
# print(merged)
print("Taken from df3: ", (from_df3))

res = pd.concat([df2, from_df3])
print("Result: ", res)

print("In residents list but not in points: ", res[~res['username'].isin(df1['username'])])

res.to_csv("./csv/residents.csv", index=False)

# print(df3[df3['name'].isin(missing_usernames['name'])])