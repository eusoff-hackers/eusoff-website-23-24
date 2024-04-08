import csv
import random
import string
import xkcdpass.xkcd_password as xp

def generate_password():
    wordlist = xp.generate_wordlist()
    return xp.generate_xkcdpassword(wordlist, delimiter="-", numwords=3)

def generate_passwords(input_file, output_file):
    """Generate passwords for each row in the CSV file."""
    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # Read and write the header
        header = next(reader)
        header.append("password")
        writer.writerow(header)

        for row in reader:
            # Generate a password
            password = generate_password()
            
            # Append the password to the row
            row.append(password)
            
            # Write the updated row to the output CSV file
            writer.writerow(row)

if __name__ == "__main__":
    input_file = "./csv/residents.csv"  # Change this to your input CSV file
    output_file = "./csv/passworded.csv"  # Change this to your output CSV file
    
    generate_passwords(input_file, output_file)