import csv
import random
import string
import xkcdpass.xkcd_password as xp

def generate_xkcd_password():
    wordlist = xp.generate_wordlist()
    return xp.generate_xkcdpassword(wordlist, delimiter="-", numwords=3)

def translate_csv(input_file, output_file):
    with open(input_file, 'r', encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile)
        fieldnames = ['role', 'gender', 'year', 'room', 'email', 'name']
        with open(output_file, 'w', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in reader:
                year_of_study = row['Year of Study']
                if year_of_study == "Exchange":
                    year_of_study = 0
                translated_row = {
                    'name': row['Name Preferred'],
                    'role': 'USER',
                    'gender': row['Gender'],
                    'year': year_of_study,
                    'room': row['Room Space'],
                    'email': row['Email'],
                }
                writer.writerow(translated_row)

if __name__ == "__main__":
    translate_csv("./csv/sem1_data.csv", "./csv/sem1_formatted.csv")