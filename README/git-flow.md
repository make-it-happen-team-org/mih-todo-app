## GIT flow

  ```
    master
    ------------------------------------------------------------------->
                                               /
                                              /
    _________________________________________/develop
               \                /
                \              /
                 \____________/feature
  ```

## Creating PR:
- git fetch --all
- git pull upstream develop
- git commit -m ‘Merging Comment ….’
- git push origin [ feature branch ]
- check if branch have no conflict with ```upstream develop```
- Create PR
