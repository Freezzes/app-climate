import numpy as np
import warnings

class Calculate_service():

  def __init__(self, data, startyear, startmonth, stopyear, stopmonth):
    self.data = data
    print("len",len(self.data))
    # print("year",len(self.data[0]))
    # print(len(self.data[0]['data'][0]))
    # print("data",type(self.data[2][0]['data']))
    # print("len",len(self.data[0]['data']))
    # print("month",self.data[0][0]['month'])
    self.startyear = startyear
    self.startmonth = startmonth
    self.stopyear = stopyear
    self.stopmonth = stopmonth
    # print(stopmonth)

  def avg_data1(self):
    res = []

    with warnings.catch_warnings():
      warnings.simplefilter("ignore", category=RuntimeWarning)
      temp = []
      # for y in range(0,(self.stopyear-self.startyear)+1):
        # print(y)

      for i in range(self.startyear,self.stopyear+1):
        print(i)
        for j in range(self.startmonth,self.stopmonth+1):
          print(j)
          A = self.data.loc[(self.data['month'] == j)]['values']
          temp.append(A)
        
        print(len(temp))

      temp = np.array(temp, dtype=np.float)
      temp = np.nanmean(temp, axis=0)
      res.append(temp)
      res = np.where(np.isnan(res), None, res)
    # # return "test"
    return res.tolist()
          # if (y == 0 and self.startmonth != 0):
          #   print("if",y)
          #   for m in range(self.startmonth, 13):
          #     print("start",m)
          #     temp.append(self.data[y]['data'][m])
          #   temp = np.array(temp, dtype=np.float)
          #   temp = np.nanmean(temp, axis=0)
          #   res.append(temp)

  def avg_data(self):
    res = []

    with warnings.catch_warnings():
      warnings.simplefilter("ignore", category=RuntimeWarning)
      # temp = []
      # for y in range(0,(self.stopyear-self.startyear)+1):
        # print(y)

      for y in range(self.startyear,self.stopyear+1):
        temp = []
        if (y == self.startyear and self.startmonth != 0):
          for m in range(self.startmonth, 13):
            A = self.data.loc[(self.data['month'] == m) & (self.data['year'] == y)]['values']
            temp.append(A)
          print("if",len(temp))
          # temp = np.array(temp, dtype=np.float)
          # temp = np.nanmean(temp, axis=0)
          # res.append(temp)
        elif (y == self.stopyear and self.stopmonth < 12):
          for m in range(1, self.stopmonth+1):
            A = self.data.loc[(self.data['month'] == m) & (self.data['year'] == y)]['values']
            temp.append(A)
          print(len(temp))
          temp = np.array(temp, dtype=np.float)
          temp = np.nanmean(temp, axis=0)
          res.append(temp)
        else:
          for m in range(0, 12):
            A = self.data.loc[(self.data['month'] == m) & (self.data['year'] == y)]['values']
            temp.append(A)
          temp = np.array(temp, dtype=np.float)
          temp = np.nanmean(temp, axis=0)
          res.append(temp)
        
      res = np.array(res, dtype=np.float)
      res = np.nanmean(res, axis=0)
      res = np.where(np.isnan(res), None, res)
    return res.tolist(),self.data['lat'].tolist(),self.data['lon'].tolist()

  def getAverageMap(self):
    res = []

    with warnings.catch_warnings():
      warnings.simplefilter("ignore", category=RuntimeWarning)
      for y in range(0, len(self.data)):
          print("y",y)
          temp = []
          if (y == 0 and self.startmonth != 0):
            print("if",y)
            for m in range(self.startmonth, 13):
              print("start",m)
              temp.append(self.data[y]['data'][m])
            temp = np.array(temp, dtype=np.float)
            temp = np.nanmean(temp, axis=0)
            res.append(temp)
          elif y == len(self.data) and stopmonth < 12:
            print("stop",m)
            print("elif",y)
            for m in range(1, self.stopmonth):
                temp.append(self.data[y]['data'][m])
            temp = np.array(temp, dtype=np.float)
            temp = np.nanmean(temp, axis=0)
            res.append(temp)
          else:
            print("else",y)
            res.append(self.data[0]['data'][0])
          
      res = np.array(res, dtype=np.float)
      res = np.nanmean(res, axis=0)
      res = np.where(np.isnan(res), None, res)
    return res.tolist()

  def getAverageMap1(self):
      res = []

      with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=RuntimeWarning)
        for y in range(0, len(self.data)):
          # print("y",y)
          temp = []
          if (y == 0 and self.startmonth != 0):
            # print("if",y)
            for m in range(self.startmonth, 13):
              # print("start",m)
              temp.append(self.data[y][m-1]['data'])
            # print("eeeeeeeeeeee",len(temp))
            temp = np.array(temp, dtype=np.float)
            temp = np.nanmean(temp, axis=0)
            res.append(temp)
            # print("1",len(res))
            print("1",temp)
          elif y == len(self.data)-1 and self.stopmonth < 12:
            # print("elif",y)
            for m in range(1, self.stopmonth):
              # print("stop",m)
              temp.append(self.data[y][m-1]['data'])
            temp = np.array(temp, dtype=np.float)
            temp = np.nanmean(temp, axis=0)
            res.append(temp)
            # print("2",temp)
            # print("2",len(res))
          else:
            # print("else",y)
            for m in range(0, 12):
              # print("m_else",m)
              temp.append(self.data[y][m]['data'])
            temp = np.array(temp, dtype=np.float)
            temp = np.nanmean(temp, axis=0)
            res.append(temp)
            # print("3",temp)
            # print("3",len(res))

        print(type(res))  
        # res = np.array(res, dtype=np.float)
        # res = np.nanmean(res, axis=0)
        # res = np.where(np.isnan(res), None, res)
      # return res.tolist()
      return "test"

  def avg_global_year(self):
      res = []

      with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=RuntimeWarning)
        for y in range(0, len(self.data)):
          print("y",y)
          temp = []
          allt = []
          if (y == 0 and self.startmonth != 0):
            print("if",y)
            for m in range(self.startmonth, 13):
              print("start",m)
              temp.append(self.data[y][m-1]['data'])
              avg = np.array(temp, dtype=np.float)
              avg = np.nanmean(avg)
              allt.append(avg)
              print(allt)
            print("eeeeeeeeeeee",len(temp))
            allt = np.array(allt, dtype=np.float)
            allt = np.nanmean(allt)
            res.append(allt)
            print("1",len(res))
            print("1",res)
          elif y == len(self.data)-1 and self.stopmonth < 12:
            print("elif",y)
            for m in range(1, self.stopmonth):
              print("stop",m)
              temp.append(self.data[y][m-1]['data'])
              avg = np.array(temp, dtype=np.float)
              avg = np.nanmean(avg)
              allt.append(avg)
            allt = np.array(allt, dtype=np.float)
            allt = np.nanmean(allt)
            res.append(allt)
            print("2",res)
            print("2",len(res))
          else:
            print("else",y)
            for m in range(0, 12):
              print("m_else",m)
              temp.append(self.data[y][m]['data'])
              avg = np.array(temp, dtype=np.float)
              avg = np.nanmean(avg)
              allt.append(avg)
            allt = np.array(allt, dtype=np.float)
            allt = np.nanmean(allt)
            res.append(allt)
            print("3",res)
            # print("3",len(res))

        print(res)  
        # res = np.array(res, dtype=np.float)
        # res = np.nanmean(res, axis=0)
        # res = np.where(np.isnan(res), None, res)
      return res
      # return "test"