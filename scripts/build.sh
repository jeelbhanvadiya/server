# If the directory, `dist`, doesn't exist, create `dist`
stat build || mkdir build
# Archive artifacts
# cd build
zip build/properties.zip -r package.json src .platform sample.env .npmrc signImages